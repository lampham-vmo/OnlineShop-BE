import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@paypal/paypal-server-sdk';

export class CreateOrderPaypalReponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: OrderStatus;
}
