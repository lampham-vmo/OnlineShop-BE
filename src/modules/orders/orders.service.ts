import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderDetail } from './entities/order.detail.entity';
import {
  OrderMonthTotal,
  OrderPagingDTO,
  OrderResponseDTO,
  SoldQuantityProduct,
} from './dto/response/order.response.dto';
import { plainToInstance } from 'class-transformer';
import { UserPayLoad } from 'src/common/type/express';
import { Status } from './enum/status.enum';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/Entity/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartProduct } from '../cart/entities/cart_product.entity';
import { PaypalService } from '../paypal/paypal.service';
import { OrderStatus } from '@paypal/paypal-server-sdk';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    private readonly paypalService: PaypalService,
    private readonly emailService: EmailService,
  ) {}

  async createCod(createOrderDTO: CreateOrderDto, userId: number | undefined) {
    if (userId === undefined) {
      throw new BadRequestException('Token not valid');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stockBackup = new Map<number, number>(); // productId -> originalStock
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart Not Found');
      }
      for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(
          this.productRepository.target,
          {
            where: { id: item.product.id, isDeleted: false },
            lock: { mode: 'pessimistic_write' },
          },
        );

        if (!product) {
          throw new BadRequestException('Product Not Found');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Product ${product.name} is out of stock`,
          );
        }

        stockBackup.set(product.id, product.stock); // backup stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      const orderDetails: OrderDetail[] = cart.items.map((item) => {
        const result = plainToInstance(OrderDetail, item.product, {
          excludeExtraneousValues: true,
        });
        result.quantity = item.quantity;
        return result;
      });
      const order = this.orderRepository.create({
        subTotal: cart.subtotal,
        total: cart.total,
        receiver: createOrderDTO.receiver,
        receiver_phone: createOrderDTO.receiver_phone,
        delivery_address: createOrderDTO.delivery_address,
        user: { id: userId },
        order_details: orderDetails,
        status: Status.PENDING,
        payment: { id: createOrderDTO.paymentId },
      });
      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.manager.delete(CartProduct, { cart: { id: cart.id } });

      await queryRunner.manager.update(
        Cart,
        { id: cart.id },
        {
          total: 0,
          subtotal: 0,
        },
      );
      await queryRunner.commitTransaction();

      await this.emailService.sendConfirmMailSuccess(user.email, savedOrder);

      return {
        jsonResponse: { id: savedOrder.id, status: 'CREATED' },
        httpStatusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createPayPal(
    createOrderDTO: CreateOrderDto,
    userId: number | undefined,
  ) {
    if (userId === undefined) {
      throw new BadRequestException('Token not valid');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const stockBackup = new Map<number, number>();
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart Not Found');
      }
      for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(
          this.productRepository.target,
          {
            where: { id: item.product.id },
            lock: { mode: 'pessimistic_write' },
          },
        );

        if (!product) {
          throw new BadRequestException('Product Not Found');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Product ${product.name} is out of stock`,
          );
        }

        stockBackup.set(product.id, product.stock);
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }
      // Call to paypal service to createOrderPaypal
      const resultCreateOrderPaypal = await this.paypalService.createOrder({
        total: cart.subtotal,
      });

      // OrderPaypalId
      const paypalOrderId = resultCreateOrderPaypal.jsonResponse.id;

      // Insert OrderDetails (Success)
      const orderDetails: OrderDetail[] = cart.items.map((item) => {
        const result = plainToInstance(OrderDetail, item.product, {
          excludeExtraneousValues: true,
        });
        result.quantity = item.quantity;
        return result;
      });

      const order = this.orderRepository.create({
        subTotal: cart.subtotal,
        total: cart.total,
        receiver: createOrderDTO.receiver,
        receiver_phone: createOrderDTO.receiver_phone,
        delivery_address: createOrderDTO.delivery_address,
        user: { id: userId },
        order_details: orderDetails,
        status: Status.UNPAID,
        payment: { id: createOrderDTO.paymentId },
        orderPaypalId: paypalOrderId,
      });
      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.manager.delete(CartProduct, { cart: { id: cart.id } });

      await queryRunner.manager.update(
        Cart,
        { id: cart.id },
        {
          total: 0,
          subtotal: 0,
        },
      );
      await queryRunner.commitTransaction();

      return {
        jsonResponse: {
          ...resultCreateOrderPaypal.jsonResponse,
          id: `${paypalOrderId}-${savedOrder.id}`,
        },
        httpStatusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page: number,
    user: UserPayLoad | undefined,
  ): Promise<OrderPagingDTO> {
    try {
      const pageSize = 10;
      const where: any = {};
      if (user === undefined) {
        throw new BadRequestException('Not valid Token');
      }
      if (user.role !== 1) {
        where.user = { id: user.id };
      }
      const [order, totalItems] = await this.orderRepository.findAndCount({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' },
        relations: ['order_details', 'payment'],
      });
      const transformed = plainToInstance(
        OrderResponseDTO,
        order.map((o) => ({
          ...o,
        })),
      );
      const pagination = {
        currentPage: +page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
      };
      return new OrderPagingDTO(transformed, pagination);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<OrderResponseDTO> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['order_details', 'payment'],
      });
      if (order === null) {
        throw new BadRequestException('Order Not Found!');
      }
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeStatus(status: string, id: number): Promise<string> {
    try {
      const order = await this.orderRepository.findOneBy({ id });

      if (!order) {
        throw new BadRequestException('Order Not Found!');
      }

      // Kiểm tra status có hợp lệ không
      const validStatuses = Object.values(Status);
      if (!validStatuses.includes(status as Status)) {
        throw new BadRequestException(`Invalid status: ${status}`);
      }

      order.status = status as Status;
      await this.orderRepository.save(order);

      return `Order with ID ${id} changed status to ${status} successfully.`;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException({
        message: 'Failed to change status with error: ' + e.message,
      });
    }
  }

  async validateUserOrderPaypal(
    userId: number,
    orderId: number,
    orderPaypalId: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        orderPaypalId: orderPaypalId,
        user: { id: userId },
      },
    });

    if (!order) {
      throw new Error('Order not found or not authorized.');
    }

    return order;
  }

  async captureOrderPaypal(
    orderPaypalId: string,
    orderId: string,
    email: string,
  ) {
    const { jsonResponse, httpStatusCode } =
      await this.paypalService.captureOrder(orderPaypalId);

    if (
      jsonResponse.purchase_units[0].payments.captures[0].status !==
      OrderStatus.Completed
    ) {
      throw new Error('Failed to complete checkout');
    }

    try {
      await this.changeStatus(Status.PENDING, +orderId);

      const result = await this.orderRepository.findOne({
        where: {
          id: +orderId,
        },
        relations: ['payment', 'order_details'],
      });
      await this.emailService.sendConfirmMailSuccess(email, result!);

      return {
        httpStatusCode: httpStatusCode,
        id: orderPaypalId,
        status: OrderStatus.Completed,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTotalOrders(): Promise<number> {
    return await this.orderRepository.count();
  }

  async getTotalRevenue(): Promise<number> {
    try {
      const result = await this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(order.subTotal)', 'sum')
        .where('order.status = :status', { status: `${Status.DELIVERED}` })
        .getRawOne();
      const { sum } = result;
      return Number(sum) || 0;
    } catch (err) {
      throw new InternalServerErrorException('Error Get Total Revenue');
    }
  }

  async getOrdersByMonth(): Promise<OrderMonthTotal[]> {
    try {
      const result = await this.orderRepository
        .createQueryBuilder('order')
        .select('EXTRACT(MONTH FROM order.createdAt)', 'month')
        .addSelect('COUNT(order.id)', 'total')
        .groupBy('EXTRACT(MONTH FROM order.createdAt)')
        .orderBy('EXTRACT(MONTH FROM order.createdAt)', 'ASC')
        .getRawMany();

      return result.map((item) => {
        const total_month = new OrderMonthTotal(item.month, item.total);
        return total_month;
      });
    } catch (err) {
      throw new InternalServerErrorException('Error Get Orders By Month');
    }
  }

  async getTopProducts(x: number): Promise<SoldQuantityProduct[]> {
    try {
      const topProducts: SoldQuantityProduct[] =
        await this.orderDetailRepository
          .createQueryBuilder('order_detail')
          .select('order_detail.name', 'productName') // Tên sản phẩm
          .addSelect('SUM(order_detail.quantity)', 'quantity') // Tổng số lượng bán
          .leftJoin('order_detail.order', 'order') // Liên kết với bảng Order
          .where('order.status = :status', { status: Status.DELIVERED }) // Chỉ tính đơn hàng thành công
          .groupBy('order_detail.name') // Group theo tên sản phẩm
          .orderBy('quantity', 'DESC') // Sắp xếp theo tổng số lượng bán
          .limit(x) // Giới hạn số lượng sản phẩm, ví dụ top 5
          .getRawMany();

      return topProducts;
    } catch (err) {
      throw new InternalServerErrorException('Error Get Top Products');
    }
  }
}
