import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { ProductRequest } from './DTO/requests/product.request';
import { ApiResponse } from './DTO/response/api.response';
import { ProductResponse } from './DTO/response/product.response';
import { ProductFindResponse } from './DTO/response/product.find.response';
import { ProductPagingResponse } from './DTO/response/product.paging.response';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Product } from './Entity/product.entity';

@ApiTags('Product')
@Controller(process.env.API_PREFIX || 'api/v1')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('product')
  async createProduct(
    @Body() productRequest: ProductRequest,
  ): Promise<ApiResponse<ProductResponse> | BadRequestException> {
    const result = await this.productService.createProduct(productRequest);
    return new ApiResponse<ProductResponse>(result);
  }

  @Get('product/search')
  @ApiQuery({ name: 'text', required: true })
  async searchProductByName(
    @Query('text') text: string,
  ): Promise<ApiResponse<Partial<ProductFindResponse>>> {
    const result = await this.productService.findProductBySearch(text);
    return new ApiResponse<Partial<ProductFindResponse>>(result);
  }

  @Get('product/paging')
  @ApiQuery({ name: 'text', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'orderField', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  async getProductPagination(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('orderField') orderField: string,
    @Query('orderBy') orderBy: string,
  ): Promise<ApiResponse<ProductPagingResponse>> {
    return new ApiResponse<ProductPagingResponse>(
      await this.productService.GetProductPagination(
        text,
        page,
        orderField,
        orderBy,
      ),
    );
  }

  @Get('product')
  async getAllProduct(): Promise<Product[]> {
    return await this.productService.GetAllProduct();
  }

  @Patch('product/:id')
  @ApiBody({ type: ProductRequest })
  async updateProductDetail(
    @Param('id') id: number,
    @Body() productUpdateDto: ProductRequest,
  ): Promise<ApiResponse<ProductResponse>> {
    const result = await this.productService.UpdateProduct(
      id,
      productUpdateDto,
    );
    return new ApiResponse<ProductResponse>(result);
  }

  @Delete('product/:id')
  async removeProduct(@Param('id') id: number): Promise<ApiResponse<string>> {
    const result = await this.productService.deleteProduct(id);
    return new ApiResponse<string>(result);
  }

  @Get('product/:id')
  async getProductById(
    @Param('id') id: number,
  ): Promise<ApiResponse<ProductResponse>> {
    const result = await this.productService.getProductById(id);
    return new ApiResponse<ProductResponse>(result);
  }

  // Get your own jwt key
  @Get('product')
  returnJwtKey(@Body('id') id: number) {
    return this.authService.createApiKey()
  }
}
