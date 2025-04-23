import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { OrdersService } from './orders.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { CreateOrderDto } from './dto/request/create-order.dto';

@Processor('orderQueue')
@Injectable()
export class OrderProccess {
  constructor(private readonly orderService: OrdersService) {}

  async process(
    job: Job<{ createOrderDTO: CreateOrderDto; userId: number | undefined }>,
  ) {
    const { createOrderDTO, userId } = job.data;

    try {
      await this.orderService.create(createOrderDTO, userId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
