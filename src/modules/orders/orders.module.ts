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
import { PaypalModule } from '../paypal/paypal.module';
import { PaypalService } from '../paypal/paypal.service';

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
    PaypalModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService, OrderProccess, PaypalService],
})
export class OrdersModule {}
