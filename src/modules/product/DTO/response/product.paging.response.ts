import { Expose } from 'class-transformer';
import { ProductResponse } from './product.response';

export class ProductPagingResponse {
  @Expose()
  products: ProductResponse[];

  @Expose()
  pagination: {};

  constructor(products: ProductResponse[], pagination: {}) {
    this.products = products;
    this.pagination = pagination;
  }
}
