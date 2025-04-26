import { Cart } from '../entities/cart.entity';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartProduct } from '../entities/cart_product.entity';
import { Product } from 'src/modules/product/Entity/product.entity';
import { ProductResponse } from 'src/modules/product/DTO/response/product.response';
import { APIResponseDTO } from 'src/common/dto/response-dto';

export class AddToCartProductDTO extends PickType(CartProduct, ['quantity']) {
  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  productId: number;
}

export class ChangeCartProductDTO extends PickType(CartProduct, ['id']) {}

export class ChangeCartProductQuantity extends PickType(CartProduct, ['id']) {}

export class CartProductResponseDTO extends OmitType(CartProduct, [
  'cart',
  'id',
  'product',
]) {
  @ApiProperty({ type: ProductResponse })
  product: ProductResponse;
}

export class CartResponseDTO extends OmitType(Cart, ['user', 'items']) {
  @ApiProperty({ type: [CartProductResponseDTO] })
  items: CartProductResponseDTO[];
}

export class GetCartFinalResponseDTO extends APIResponseDTO<Cart> {
  @ApiProperty({ type: () => Cart })
  data: Cart = new Cart();
}
