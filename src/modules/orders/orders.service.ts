import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderDetail } from './entities/order.detail.entity';
import {
  OrderPagingDTO,
  OrderResponseDTO,
} from './dto/response/order.response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserPayLoad } from 'src/common/type/express';
import { Status } from './enum/status.enum';
import { User } from '../user/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Product } from '../product/Entity/product.entity';
import { Cart } from '../cart/entities/cart.entity';

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
      const cart = await queryRunner.manager.findOne(Cart,{
        where:{id: createOrderDTO.cartId}
      })
      if(!cart){
        throw new BadRequestException("Cart Not Found")
      }
      for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(this.productRepository.target, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });
  
        if (!product) {
          throw new BadRequestException('Product Not Found');
        }
  
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Product ${product.name} is out of stock`);
        }
  
        stockBackup.set(product.id, product.stock); // backup stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }
  
      const orderDetails: OrderDetail[] = cart.items.map((item) =>
        plainToInstance(OrderDetail, item, { excludeExtraneousValues: true })
      );
  
      const order = this.orderRepository.create({
        subTotal: cart.subtotal,
        total: cart.total,
        receiver: createOrderDTO.receiver,
        receiver_phone: createOrderDTO.receiver_phone,
        delivery_address: createOrderDTO.delivery_address,
        user: { id: userId },
        order_details: orderDetails,
        status: Status.orderSuccess,
      });
  
      const savedOrder = await queryRunner.manager.save(order);
  
      await queryRunner.commitTransaction();
  
      return `Order with id: ${savedOrder} is created`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Order failed. Rolled back transaction.');
    } finally {
      await queryRunner.release();
    }
  }

  async createPayPal(
    createOrderDto: CreateOrderDto,
    userId: number | undefined,
  ): Promise<string> {
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
      const cart = await queryRunner.manager.findOne(Cart,{
        where:{id: createOrderDto.cartId}
      })
      if(!cart){
        throw new BadRequestException("Cart Not Found")
      }
      for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(this.productRepository.target, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });
  
        if (!product) {
          throw new BadRequestException('Product Not Found');
        }
  
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Product ${product.name} is out of stock`);
        }
  
        stockBackup.set(product.id, product.stock); // backup stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }
  
      const orderDetails: OrderDetail[] = cart.items.map((item) =>
        plainToInstance(OrderDetail, item, { excludeExtraneousValues: true })
      );
  
      const order = this.orderRepository.create({
        subTotal: cart.subtotal,
        total: cart.total,
        receiver: createOrderDto.receiver,
        receiver_phone: createOrderDto.receiver_phone,
        delivery_address: createOrderDto.delivery_address,
        user: { id: userId },
        order_details: orderDetails,
        status: Status.unpaid,
      });
  
      const savedOrder = await queryRunner.manager.save(order);
  
      await queryRunner.commitTransaction();
  
      return `Order with id: ${savedOrder} is created`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Order failed. Rolled back transaction.');
    } finally {
      await queryRunner.release();
    }
  }
  


  async findAll(
    page: number,
    user: UserPayLoad | undefined,
  ): Promise<OrderPagingDTO> {
    const pageSize = 10;
    const where: any = {};
    if (user === undefined) {
      throw new BadRequestException('Not valid Token');
    }
    if (user.role !== 1) {
      where.user_id = user.id;
    }

    const [order, totalItems] = await this.orderRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
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
  }

  async findOne(id: number): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_detail'],
    });
    if (order === null) {
      throw new BadRequestException('Order Not Found!');
    }
    return order;
  }

  async changeStatus(status: Status, id: number): Promise<string> {
    try {
      const orderStatus = await this.orderRepository.findOneBy({
        id: id,
      });
      if (orderStatus === null) {
        throw new BadRequestException('Order Not Found!');
      }
      orderStatus.status = status;
      await this.orderRepository.save(orderStatus);
      return `order with id: ${id} change status success`;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        'Failed to change order status with error: ' + e,
      );
    }
  }
}
