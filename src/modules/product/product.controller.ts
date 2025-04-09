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
import { ProductUpdateDto } from './DTO/product-update.dto';
import { plainToClass } from 'class-transformer';
import { ApiQuery } from '@nestjs/swagger';

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
  async searchProductByName(
    @Query('text') text: string,
  ): Promise<ApiResponse<Partial<ProductFindResponse>>> {
    const result = await this.productService.findProductBySearch(text);
    return new ApiResponse<Partial<ProductFindResponse>>(result);
  }

  @Get('product/paging')
  @ApiQuery({ name: 'text', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'orderField', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  async GetProductPagination(
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

  @Patch('product/:id')
  async updateProductDetail(
    @Param('id') id:number,
    @Body() productUpdateDto: ProductUpdateDto,
  ): Promise<ApiResponse<ProductResponse>> {
    const result = await this.productService.UpdateProduct(id, productUpdateDto);
    return new ApiResponse<ProductResponse>(result)
  }

  @Delete('product/:id')
  remove(@Param('id') id: number) {
    return `The product with ${id} has been deleted.`
  }
}
