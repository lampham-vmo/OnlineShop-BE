import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order.detail.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { BullModule } from '@nestjs/bullmq';
import { Product } from '../product/Entity/product.entity';
import { OrderProccess } from './order.process';
import { PaymentMethod } from '../payment-method/entities/payment-method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDetail,
      User,
      Product,
      PaymentMethod,
    ]),
    BullModule.registerQueue({
      name: 'orderQueue',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService, OrderProccess],
})
export class OrdersModule {}
