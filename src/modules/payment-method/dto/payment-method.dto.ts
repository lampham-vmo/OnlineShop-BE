import { PickType } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto extends PickType(PaymentMethod, ['name']) {}

export class PaymentMethodResponseDto extends PickType(PaymentMethod, [
  'id',
  'name',
  'status',
]) {}
