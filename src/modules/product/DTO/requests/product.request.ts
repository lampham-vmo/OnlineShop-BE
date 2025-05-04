import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../../Entity/product.entity';

export class ProductRequest extends OmitType(Product, [
  'category',
  'id',
  'updatedAt',
  'createdAt',
  'isDeleted',
  'rating',
  'cartProducts',
]) {
  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'category id',
    type: 'number',
    nullable: false,
  })
  categoryId: number;
}
