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

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<APIResponseDTO<string>> {
    const userId = req.user?.id;
    const result = await this.ordersService.create(createOrderDto, userId);
    return new APIResponseDTO<string>(true, 200, result);
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Req() req: Request,
  ): Promise<APIResponseDTO<OrderPagingDTO>> {
    const user = req.user;
    const result = await this.ordersService.findAll(+page, user);
    return new APIResponseDTO<OrderPagingDTO>(true, 200, result);
  }

  @Get(':id')
  async findOneOrder(
    @Param('id') id: string,
  ): Promise<APIResponseDTO<OrderResponseDTO>> {
    const result = await this.ordersService.findOne(+id);
    return new APIResponseDTO<OrderResponseDTO>(true, 200, result);
  }

  @Patch('/status/:id')
  async changeStatus(@Param('id') id: string): Promise<APIResponseDTO<string>> {
    const result = await this.ordersService.changeStatus(
      Status.orderAccept,
      +id,
    );
    return new APIResponseDTO<string>(true, 200, result);
  }
}
