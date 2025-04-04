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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('/all')
  getAll() {
    return this.categoryService.getListCategory();
  }

  @Get('')
  getList(@Query() query: CategoryQueryDto) {
    return this.categoryService.getListCategoryWithPagination(query);
  }

  @Get(':id')
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

  @UseGuards(AuthGuard)
  @Delete(':id')
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
