import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { CategoryPaginationData, CategoryQueryDto, CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBearerAuth()
  @ApiExtraModels(APIResponseDTO, CategoryResponseDto)
  @ApiResponse({status: 201, schema: {
    allOf: [
      { $ref: getSchemaPath(APIResponseDTO)},
      {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(CategoryResponseDto)}
        }
      }
    ]
  }})
  @ApiBody({
    type: CreateCategoryDto
	})
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('/all')
  @ApiExtraModels(APIResponseDTO, CategoryResponseDto)
  @ApiResponse({status: 200, schema: {
    allOf: [
      { $ref: getSchemaPath(APIResponseDTO)},
      {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(CategoryResponseDto)}
        }
      }
    ]
  }})
  getAll() {
    return this.categoryService.getListCategory();
  }

  @Get('')
  @ApiExtraModels(APIResponseDTO, CategoryPaginationData)
  @ApiResponse({status: 200, schema: {
    allOf: [
      { $ref: getSchemaPath(APIResponseDTO)},
      {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(CategoryPaginationData)}
        }
      }
    ]
  }})
  getList(@Query() query: CategoryQueryDto) {
    return this.categoryService.getListCategoryWithPagination(query);
  }

  @Get(':id')
  @ApiExtraModels(APIResponseDTO, Category)
  @ApiResponse({status: 200, schema: {
    allOf: [
      { $ref: getSchemaPath(APIResponseDTO)},
      {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(Category)}
        }
      }
    ]
  }})
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException({ message: 'ID must be a number' }),
      }),
    )
    id: number,
  ) {
    return this.categoryService.findOneCategoryById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiExtraModels(APIResponseDTO, Category)
  @ApiResponse({status: 200, schema: {
    allOf: [
      { $ref: getSchemaPath(APIResponseDTO)},
      {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(Category)}
        }
      }
    ]
  }})
  @ApiBody({
    type: UpdateCategoryDto
	})
  @UseGuards(AuthGuard)
  update(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException({ message: 'ID must be a number' }),
      }),
    )
    id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({status: 200, schema: {
    allOf: [
      { $ref: getSchemaPath(APIResponseDTO)},
      {
        type: 'object',
        properties: {
          data: {
            type: 'string'
          }
        }
      }
    ]
  }})
  delete(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException({ message: 'ID must be a number' }),
      }),
    )
    id: number,
  ) {
    return this.categoryService.deleteCategory(id);
  }
}
