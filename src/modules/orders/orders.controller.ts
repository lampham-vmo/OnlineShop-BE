import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import {
  GetTopProductResponseDTO,
  OrderByMonthResponseDTO,
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
import { CreateOrderPaypalReponseDto } from '../paypal/dto/paypal.dto';
import { ChangeStatusRequest } from './dto/request/change-status.request';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue('orderQueue') private readonly orderQueue: Queue,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponseWithModel(CreateOrderPaypalReponseDto)
  async create(
    @Req() req: Request,
    @Body() createOrderDTO: CreateOrderDto,
  ): Promise<APIResponseDTO<CreateOrderPaypalReponseDto>> {
    try {
      const userId = req.user?.id;
      const job = await this.orderQueue.add('orderQueue', {
        createOrderDTO,
        userId,
      });
      const queueEvents = new QueueEvents('orderQueue', {
        connection: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT) || 6379,
          password: process.env.REDIS_PASSWORD,
          username: process.env.REDIS_USER || 'default',
        },
      });
      await queueEvents.waitUntilReady();
      const { jsonResponse, httpStatusCode } =
        await job.waitUntilFinished(queueEvents);
      return new APIResponseDTO<CreateOrderPaypalReponseDto>(
        true,
        httpStatusCode,
        jsonResponse,
      );
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  @Post(':orderPaypalId/:orderId/capture')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponseWithModel(CreateOrderPaypalReponseDto)
  async captureOrder(
    @Param('orderPaypalId') orderPaypalId: string,
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = req.user?.id!;

      await this.ordersService.validateUserOrderPaypal(
        userId,
        +orderId,
        orderPaypalId,
      );

      const { httpStatusCode, id, status } =
        await this.ordersService.captureOrderPaypal(
          orderPaypalId,
          orderId,
          req.user?.email!,
        );

      return new APIResponseDTO<CreateOrderPaypalReponseDto>(
        true,
        httpStatusCode,
        {
          id,
          status,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
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

  @Patch('/status')
  @ApiResponseWithPrimitive('string')
  @UseGuards(AuthGuard, RoleGuard)
  async changeStatus(
    @Body() change: ChangeStatusRequest,
  ): Promise<APIResponseDTO<string>> {
    const result = await this.ordersService.changeStatus(
      change.status,
      +change.id,
    );
    return new APIResponseDTO<string>(true, 200, result);
  }

  @Get('statistic/total-orders')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponseWithPrimitive('number')
  async getTotalOrders(): Promise<APIResponseDTO<number>> {
    const result = await this.ordersService.getTotalOrders();
    return new APIResponseDTO<number>(true, 200, result);
  }

  @Get('statistic/total-revenue')
  @ApiResponseWithPrimitive('number')
  @UseGuards(AuthGuard, RoleGuard)
  async getTotalRevenue(): Promise<APIResponseDTO<number>> {
    const result = await this.ordersService.getTotalRevenue();
    return new APIResponseDTO<number>(true, 200, result);
  }

  @Get('statistic/orders-by-month')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponseWithModel(OrderByMonthResponseDTO)
  async getOrdersByMonth(): Promise<APIResponseDTO<OrderByMonthResponseDTO>> {
    const result = await this.ordersService.getOrdersByMonth();
    return new APIResponseDTO<OrderByMonthResponseDTO>(true, 200, {
      orders: result,
    });
  }

  @Get('statistic/top-product/:number')
  @ApiResponseWithModel(GetTopProductResponseDTO)
  async getTopProduct(
    @Param('number') x: string,
  ): Promise<APIResponseDTO<GetTopProductResponseDTO>> {
    const result = await this.ordersService.getTopProducts(+x);
    return new APIResponseDTO<GetTopProductResponseDTO>(true, 200, {
      topProducts: result,
    });
  }
}
