import { BadRequestException, Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRequest } from './DTO/requests/product.request';
import { Product } from './Entity/product.entity';
import { ApiResponse } from './DTO/response/api.response';
import { ProductResponse } from './DTO/response/product.response';

@Controller(process.env.API_PREFIX||"api/v1")
export class ProductController {
    constructor(private productService: ProductService){}

    @Post("product")
    async createProduct(@Body() productRequest: ProductRequest): Promise<ApiResponse<ProductResponse>| BadRequestException>{
        return new ApiResponse<ProductResponse>(await this.productService.createProduct(productRequest))
    }
    
    @Get("product/search/:text")
    async searchProductByName(@Param("text") text: string): Promise<ApiResponse<Partial<ProductResponse>[]>>{
        const result = await this.productService.findProductBySearch(text);
        return new ApiResponse<Partial<ProductResponse>[]>(result);
    }
}
