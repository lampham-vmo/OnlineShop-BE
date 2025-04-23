import { Cart } from "../entities/cart.entity";
import {
    ApiProperty,
    ApiPropertyOptional,
    PartialType,
    PickType,
  } from '@nestjs/swagger';
  import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
  import { Type } from 'class-transformer';
import { CartProduct } from "../entities/cart_product.entity";

export class AddToCartProductDTO extends PickType(CartProduct,["quantity"]) {
  @IsInt()
  @ApiProperty()
  userId: number;

  @IsInt()
  @ApiProperty()
  productId: number
}

export class ChangeCartProductQuantity extends PickType(CartProduct,["id"]){}