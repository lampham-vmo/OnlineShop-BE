import { PaginationDTO } from './pagination.response';
import { ProductResponse } from './product.response';
import { ApiProperty } from '@nestjs/swagger';

export class ProductPagingResponse {
  @ApiProperty({ type: [ProductResponse] })
  products: ProductResponse[];

  @ApiProperty({ type: PaginationDTO })
  pagination: PaginationDTO;

  constructor(products: ProductResponse[], pagination: PaginationDTO) {
    this.products = products;
    this.pagination = pagination;
  }
}
