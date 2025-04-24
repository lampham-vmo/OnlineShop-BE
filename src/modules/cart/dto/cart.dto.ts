import { Cart } from "../entities/cart.entity";
import {
    ApiProperty,
    ApiPropertyOptional,
    OmitType,
    PartialType,
    PickType,
  } from '@nestjs/swagger';
  import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
  import { Type } from 'class-transformer';
import { CartProduct } from "../entities/cart_product.entity";
import { Product } from "src/modules/product/Entity/product.entity";
import { ProductResponse } from "src/modules/product/DTO/response/product.response";

export class AddToCartProductDTO extends PickType(CartProduct,["quantity"]) {
  @IsInt()
  @ApiProperty()
  userId: number;

  @IsInt()
  @ApiProperty()
  productId: number
}

export class ChangeCartProductQuantity extends PickType(CartProduct,["id"]){}

export class CartProductResponseDTO extends OmitType(CartProduct,['cart','id','product']){
  @ApiProperty({type: ProductResponse})
  product: ProductResponse;
}

export class CartResponseDTO extends OmitType(Cart,['user','items']){
  @ApiProperty({type: [CartProductResponseDTO]})
  items: CartProductResponseDTO[];
}