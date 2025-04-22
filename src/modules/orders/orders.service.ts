import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderDetail } from './entities/order.detail.entity';
import { OrderPagingDTO, OrderResponseDTO } from './dto/response/order.response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserPayLoad } from 'src/common/type/express';
import { Status } from './enum/status.enum';
import { User } from '../user/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    @InjectQueue('orderQueue') private readonly orderQueue: Queue,
  ){}

  async addToQueue(createOrderDTO: CreateOrderDto, userId: number|undefined){
    const job = await this.orderQueue.add('orderQueue',{createOrderDTO,userId})
  }

  async create(createOrderDto: CreateOrderDto,userId: number|undefined): Promise<string> {
    if(userId === undefined){
      throw new BadRequestException("Token not valid")
    }
    const user = this.userRepository.exists({
      where: {id: userId}
    })
    if(!user){
      throw new BadRequestException("User Not Found")
    }
    //get list product in cart then insert to order detail
    //create order
    const order = this.orderRepository.create({
      subTotal: 1000,
      total: 2000,
      receiver: createOrderDto.receiver,
      receiver_phone: createOrderDto.receiver_phone,
      delivery_address: createOrderDto.delivery_address,
      user: {id: userId},
      order_details: [],
    })
    const result = await this.orderRepository.save(order)

    return `Order with id: ${result.id} is created`;
  }

  async findAll(page: number,user: UserPayLoad| undefined): Promise<OrderPagingDTO>  {
    const pageSize = 10;
    const where: any = {};
    if(user === undefined){
      throw new BadRequestException("Not valid Token")
    }
    if(user.role !== 1){
      where.user_id = user.id
    }

    const [order,totalItems] = await this.orderRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    
    const transformed = plainToInstance(OrderResponseDTO,order.map((o)=>({
      ...o
    })))
    const pagination = {
      currentPage: +page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems: totalItems,
    };
    return new OrderPagingDTO(transformed,pagination);
  }

  async findOne(id: number): Promise<OrderResponseDTO> {
    const order = await this.orderRepository.findOne({
      where: {id},
      relations: ['order_detail']
    })
    if(order===null){
      throw new BadRequestException("Order Not Found!")
    }
    return order;
  }

  async changeStatus(status: Status,id: number): Promise<string>{
    try{
      const orderStatus = await this.orderRepository.findOneBy({
        id: id
      })
      if(orderStatus === null){
        throw new BadRequestException("Order Not Found!")
      }
      orderStatus.status = status
      await this.orderRepository.save(orderStatus)
      return `order with id: ${id} change status success`
    } catch(e){
      if(e instanceof BadRequestException){
        throw e;
      }
      throw new InternalServerErrorException('Failed to change order status with error: ' + e);
    }
  }
}
