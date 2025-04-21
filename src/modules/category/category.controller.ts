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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import {
  CategoryPaginationData,
  CategoryQueryDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import {
  ApiResponseWithArrayModel,
  ApiResponseWithModel,
  ApiResponseWithPrimitive,
} from 'src/common/decorators/swagger.decorator';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @RouteName('CREATE_CATEGORY')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiResponseWithModel(CategoryResponseDto, 201)
  @ApiBody({
    type: CreateCategoryDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('/all')
  @RouteName('GET_ALL_CATEGORY')
  @ApiResponseWithArrayModel(CategoryResponseDto)
  getAll() {
    return this.categoryService.getListCategory();
  }

  @Get('')
  @RouteName('GET_LIST_CATEGORY_WITH_PAGING')
  @ApiResponseWithModel(CategoryPaginationData)
  getList(@Query() query: CategoryQueryDto) {
    return this.categoryService.getListCategoryWithPagination(query);
  }

  @Get(':id')
  @RouteName('GET_CATEGORY_BY_ID')
  @ApiResponseWithModel(Category)
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
  @RouteName('UPDATE_CATEGORY')
  @ApiBearerAuth()
  @ApiResponseWithModel(Category)
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @UseGuards(AuthGuard, RoleGuard)
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
  @RouteName('DELETE_CATEGORY')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiResponseWithPrimitive('string')
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
