import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { ProductRequest } from './DTO/requests/product.request';
import { ApiResponse } from './DTO/response/api.response';
import { ProductResponse } from './DTO/response/product.response';
import { ProductPagingResponse } from './DTO/response/product.paging.response';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ApiResponseWithModel,
  ApiResponseWithPrimitive,
} from 'src/common/decorators/swagger.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';

@ApiTags('Product')
@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('product')
  @ApiExtraModels(ApiResponse, ProductResponse)
  @ApiResponseWithModel(ProductResponse)
  async createProduct(
    @Body() productRequest: ProductRequest,
  ): Promise<ApiResponse<ProductResponse>> {
    const result = await this.productService.createProduct(productRequest);
    return new ApiResponse<ProductResponse>(result);
  }

  @Get('product/search')
  @ApiExtraModels(ApiResponse, ProductResponse)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponse) },
        {
          type: 'object',
          properties: {
            result: {
              type: 'array',
              items: { $ref: getSchemaPath(ProductResponse) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({ name: 'text', required: true })
  async searchProductByName(
    @Query('text') text: string,
  ): Promise<ApiResponse<ProductResponse[]>> {
    const result = await this.productService.findProductBySearch(text);
    return new ApiResponse<ProductResponse[]>(result);
  }

  @Get('product/paging')
  @ApiQuery({ name: 'text', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'orderField', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiExtraModels(ApiResponse, ProductPagingResponse)
  @ApiResponseWithModel(ProductPagingResponse)
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

  @Get('product/all')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'orderField', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiExtraModels(ApiResponse, ProductPagingResponse)
  @ApiResponseWithModel(ProductPagingResponse)
  async getAllProduct(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('orderField') orderField: string,
    @Query('orderBy') orderBy: string,
    @Query('categoryId') categoryId: number,
  ): Promise<ApiResponse<ProductPagingResponse>> {
    const result = await this.productService.GetAllProductPaging(
      page,
      orderField,
      orderBy,
      pageSize,
      categoryId,
    );
    return new ApiResponse<ProductPagingResponse>(result);
  }

  @Patch('product/:id')
  @ApiBody({ type: ProductRequest })
  @UseGuards(AuthGuard, RoleGuard)
  @ApiExtraModels(ApiResponse, ProductResponse)
  @ApiResponseWithModel(ProductResponse)
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
  @ApiExtraModels(ApiResponse)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponseWithPrimitive('string')
  async removeProduct(@Param('id') id: number): Promise<ApiResponse<string>> {
    const result = await this.productService.deleteProduct(id);
    return new ApiResponse<string>(result);
  }

  @Get('product/:id')
  @ApiExtraModels(ApiResponse, ProductResponse)
  @ApiResponseWithModel(ProductResponse)
  async getProductById(
    @Param('id') id: number,
  ): Promise<ApiResponse<ProductResponse>> {
    const result = await this.productService.getProductById(id);
    return new ApiResponse<ProductResponse>(result);
  }
}
