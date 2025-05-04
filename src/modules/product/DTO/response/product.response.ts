import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Product } from '../../Entity/product.entity';

export class ProductResponse extends PickType(Product, [
  'id',
  'name',
  'price',
  'stock',
  'discount',
  'image',
  'createdAt',
  'rating',
  'description',
]) {
  @ApiProperty()
  @Expose()
  priceAfterDis: number;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  categoryName: string | null;
}
