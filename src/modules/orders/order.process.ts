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
export class OrderProccess extends WorkerHost{
  constructor(
    private readonly orderService: OrdersService,
    @InjectRepository(Product) private readonly produc,
  ) { super();}

  async process(
    job: Job<{ createOrderDTO: CreateOrderDto; userId: number | undefined }>,
  ) {
    const { createOrderDTO, userId } = job.data;
    console.log("processing....")
    console.log(createOrderDTO)
    try {
      if (createOrderDTO.paymentMethod === 'paypal') {
        console.log(1)
        const result = await this.orderService.createPayPal(
          createOrderDTO,
          userId,
        );
        return result;
      } else if (createOrderDTO.paymentMethod === 'cod') {
        console.log(2)
        const result = await this.orderService.createCod(
          createOrderDTO,
          userId,
        );
        console.log(result)
        return result;
      } else {
        throw new BadRequestException('Payment method Not Found');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        // Lấy message từ BadRequestException (NestJS)
        const response = error.getResponse() as any;
        const message = typeof response === 'object' ? response.message : response;
        throw new Error(message || 'Bad Request');
      }
  
      throw error;
    }
  }
}
