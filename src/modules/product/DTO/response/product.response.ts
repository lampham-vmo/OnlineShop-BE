import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { Product } from '../../Entity/product.entity';

export class ProductResponse extends PickType(Product, [
  'id',
  'name',
  'price',
  'stock',
  'discount',
  'image',
]) {
  @Expose()
  priceAfterDis: number;

  @Expose()
  categoryName: string;
}
