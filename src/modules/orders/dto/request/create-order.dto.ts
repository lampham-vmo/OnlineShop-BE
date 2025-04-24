import { ApiProperty, PickType } from '@nestjs/swagger';
import { Order } from '../../entities/order.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { CartProduct } from 'src/modules/cart/entities/cart_product.entity';
import { CartResponseDTO } from 'src/modules/cart/dto/cart.dto';

export class CreateOrderDto extends PickType(Order, [
  'receiver',
  'receiver_phone',
  'delivery_address',
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentMethod: string

  @ApiProperty({
    type: 'string'
  })
  cartId: number 
}
