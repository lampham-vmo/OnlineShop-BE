import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRequest } from './DTO/requests/product.request';
import { Product } from './Entity/product.entity';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Post()
    async createProduct(@Body() productRequest: ProductRequest): Promise<Product| BadRequestException>{
        return this.productService.createProduct()
    } 
}
