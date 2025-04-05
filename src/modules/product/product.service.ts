import { Injectable } from '@nestjs/common';
import { Product } from './Entity/product.entity';

@Injectable()
export class ProductService {
  //TODO: create product
  createProduct(): Product {
    return new Product();
  }

  //TODO: find product search by name(Elastic Search)

  //TODO: get product by paging/detail

  //TODO: alter product
}
