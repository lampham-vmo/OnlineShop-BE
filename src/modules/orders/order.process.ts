import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { OrdersService } from './orders.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/Entity/product.entity';
//consumer 
@Processor('orderQueue')
@Injectable()
export class OrderProccess {
  constructor(
    private readonly orderService: OrdersService,
    @InjectRepository(Product) private readonly produc
  ) {}

  async process(
    job: Job<{ createOrderDTO: CreateOrderDto; userId: number | undefined }>,
  ) {
    const { createOrderDTO, userId } = job.data;
    

    try {
      if(createOrderDTO.paymentMethod === "paypal"){
        const result = await this.orderService.createPayPal(createOrderDTO, userId);
        return result
      } else if(createOrderDTO.paymentMethod === "cod"){
        const result = await this.orderService.createCod(createOrderDTO,userId);
        return result
      } else{
        throw new BadRequestException("Payment method Not Found")
      }

    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
