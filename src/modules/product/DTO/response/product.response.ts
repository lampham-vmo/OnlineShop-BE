import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Product } from '../../Entity/product.entity';
import { Time } from 'es7/api/types';
import { Timestamp } from 'typeorm';

export class ProductResponse extends PickType(Product, [
  'id',
  'name',
  'price',
  'stock',
  'discount',
  'image',
  'createdAt'
]) {

  @ApiProperty()
  @Expose()
  priceAfterDis: number;


  @ApiProperty()
  @Expose()
  categoryName: string;
}
