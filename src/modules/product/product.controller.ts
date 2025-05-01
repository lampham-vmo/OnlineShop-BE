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
import { APIResponseDTO } from 'src/common/dto/response-dto';

@ApiTags('Product')
@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('product')
  @ApiResponseWithModel(ProductResponse)
  async createProduct(
    @Body() productRequest: ProductRequest,
  ): Promise<APIResponseDTO<ProductResponse>> {
    const result = await this.productService.createProduct(productRequest);
    return new APIResponseDTO<ProductResponse>(true,200,result);
  }

  @Get('product/search')
  @ApiExtraModels(APIResponseDTO)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(APIResponseDTO) },
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
  ): Promise<APIResponseDTO<ProductResponse[]>> {
    const result = await this.productService.findProductBySearch(text);
    return new APIResponseDTO<ProductResponse[]>(true,200,result);
  }

  @Get('product/paging')
  @ApiQuery({ name: 'text', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'orderField', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiResponseWithModel(ProductPagingResponse)
  async getProductPagination(
    @Query('text') text: string,
    @Query('page') page: number,
    @Query('orderField') orderField: string,
    @Query('orderBy') orderBy: string,
  ): Promise<APIResponseDTO<ProductPagingResponse>> {
    return new APIResponseDTO<ProductPagingResponse>(true,200,
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
  @ApiResponseWithModel(ProductPagingResponse)
  async getAllProduct(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('orderField') orderField: string,
    @Query('orderBy') orderBy: string,
    @Query('categoryId') categoryId: number,
  ): Promise<APIResponseDTO<ProductPagingResponse>> {
    const result = await this.productService.GetAllProductPaging(
      page,
      orderField,
      orderBy,
      pageSize,
      categoryId,
    );
    return new APIResponseDTO<ProductPagingResponse>(true,200,result);
  }

  @Patch('product/:id')
  @ApiBody({ type: ProductRequest })
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponseWithModel(ProductResponse)
  async updateProductDetail(
    @Param('id') id: number,
    @Body() productUpdateDto: ProductRequest,
  ): Promise<APIResponseDTO<ProductResponse>> {
    const result = await this.productService.UpdateProduct(
      id,
      productUpdateDto,
    );
    return new APIResponseDTO<ProductResponse>(true,200,result);
  }

  @Delete('product/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiResponseWithPrimitive('string')
  async removeProduct(@Param('id') id: number): Promise<APIResponseDTO<string>> {
    const result = await this.productService.deleteProduct(id);
    return new APIResponseDTO<string>(true,200,result);
  }

  @Get('product/:id')
  @ApiResponseWithModel(ProductResponse)
  async getProductById(
    @Param('id') id: number,
  ): Promise<APIResponseDTO<ProductResponse>> {
    const result = await this.productService.getProductById(id);
    return new APIResponseDTO<ProductResponse>(true,200,result);
  }
}
