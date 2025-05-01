import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto extends PickType(Category, [
  'name',
  'description',
]) {}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryResponseDto extends PickType(Category, [
  'id',
  'name',
  'description',
]) {}

enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class CategoryQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    enum: EOrder,
  })
  order: 'ASC' | 'DESC';

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;
}

export class PaginationData {
  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;

  constructor(partial: Partial<PaginationData>) {
    this.totalPages = partial.totalPages ?? 0;
    this.totalItems = partial.totalItems ?? 0;
    this.currentPage = partial.currentPage ?? 1;
    this.pageSize = partial.pageSize ?? 10;
  }
}

export class CategoryPaginationData {
  @ApiProperty({ type: Category, isArray: true })
  result: Category[];

  @ApiProperty()
  pagination?: PaginationData;

  constructor(
    result: Category[],
    pagination?: PaginationData | Partial<PaginationData>,
  ) {
    this.result = result;
    this.pagination = pagination
      ? pagination instanceof PaginationData
        ? pagination
        : new PaginationData(pagination)
      : undefined;
  }
}
