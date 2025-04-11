import { ProductResponse } from './product.response';
import { ApiProperty } from '@nestjs/swagger';

export class ProductPagingResponse {
  @ApiProperty({type: [ProductResponse]})
  products: ProductResponse[];

  @ApiProperty()
  pagination: {};

  constructor(products: ProductResponse[], pagination: {}) {
    this.products = products;
    this.pagination = pagination;
  }
}
