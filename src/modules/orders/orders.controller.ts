import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Order } from './entities/order.entity';
import {
  OrderPagingDTO,
  OrderResponseDTO,
} from './dto/response/order.response.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Status } from './enum/status.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiResponseWithModel,
  ApiResponseWithPrimitive,
} from 'src/common/decorators/swagger.decorator';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue('orderQueue') private readonly orderQueue: Queue,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponseWithPrimitive('string')
  async create(
    @Req() req: Request,
    @Body() createOrderDTO: CreateOrderDto,
  ): Promise<APIResponseDTO<string>> {
    const userId = req.user?.id;
    console.log(createOrderDTO);
    const job = await this.orderQueue.add('orderQueue', {
      createOrderDTO,
      userId,
    });
    const queueEvents = new QueueEvents('orderQueue');
    await queueEvents.waitUntilReady();
    try {
      const result = await job.waitUntilFinished(queueEvents);
      return new APIResponseDTO<string>(true, 200, result);
    } catch (error) {
      throw new BadRequestException(error.message || 'Undefined error');
    }
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponseWithModel(OrderPagingDTO, 201)
  async findAll(
    @Query('page') page: number = 1,
    @Req() req: Request,
  ): Promise<APIResponseDTO<OrderPagingDTO>> {
    console.log(req.user);
    const user = req.user;
    const result = await this.ordersService.findAll(+page, user);
    return new APIResponseDTO<OrderPagingDTO>(true, 200, result);
  }

  @Get(':id')
  @ApiResponseWithModel(OrderResponseDTO)
  async findOneOrder(
    @Param('id') id: string,
  ): Promise<APIResponseDTO<OrderResponseDTO>> {
    const result = await this.ordersService.findOne(+id);
    return new APIResponseDTO<OrderResponseDTO>(true, 200, result);
  }

  @Patch('/status/:id')
  @ApiResponseWithPrimitive('string')
  async changeStatus(@Param('id') id: string): Promise<APIResponseDTO<string>> {
    const result = await this.ordersService.changeStatus(
      Status.orderAccept,
      +id,
    );
    return new APIResponseDTO<string>(true, 200, result);
  }
}
