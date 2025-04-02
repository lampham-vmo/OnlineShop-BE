import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';

export interface PaginationData {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export interface CategoryData {
  result: Category[];
  pagination?: PaginationData;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<APIResponseDTO<Category>> {
    createCategoryDto.name = createCategoryDto.name.trim();

    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, deleted: false },
    });
    if (existingCategory) {
      throw new BadRequestException({
        message: `Category name: "${existingCategory.name}" existed`,
      });
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    const result = await this.categoryRepository.save(newCategory);
    return {
      success: true,
      statusCode: 201,
      data: result,
    };
  }

  async getListCategory(
    query: CategoryQueryDto,
  ): Promise<APIResponseDTO<CategoryData>> {
    let {
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page,
      pageSize,
    } = query;

    page = Number(page) > 0 ? Number(page) : 1;
    pageSize = Number(pageSize) > 0 ? Number(pageSize) : 20;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.deleted = :deleted', { deleted: false });

    if (search) {
      queryBuilder.andWhere(`category.name LIKE :name`, { name: `%${search}%` });
    }

    queryBuilder.orderBy(`category.${sortBy}`, order).skip(skip).take(pageSize);

    const [categories, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / pageSize);

    return {
      success: true,
      statusCode: 200,
      data: {
        result: categories,
        pagination: {
          totalItems: total,
          totalPages: totalPages,
          currentPage: page,
          pageSize: pageSize,
        },
      },
    };
  }

  private async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id, deleted: false } });
    if (!category) {
      throw new NotFoundException({
        message: `Category with ID ${id} not found`,
      });
    }
    return category;
  }

  async findOneCategoryById(id: number): Promise<APIResponseDTO<Category>> {
    const category = await this.findCategoryById(id);
    return {
      success: true,
      statusCode: 200,
      data: category,
    };
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<APIResponseDTO<Category>> {
    await this.findCategoryById(id);

    if (updateCategoryDto.name) {
      updateCategoryDto.name = updateCategoryDto.name.trim();

      const duplicateCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, id: Not(id), deleted: false },
      });

      if (duplicateCategory) {
        throw new BadRequestException({
          message: 'Category name already exists',
        });
      }
    }

    await this.categoryRepository.update(id, updateCategoryDto);

    return await this.findOneCategoryById(id);
  }

  async deleteCategory(id: number): Promise<APIResponseDTO<object>> {
    await this.findCategoryById(id);

    await this.categoryRepository.update({ id }, { deleted: true });

    // TODO: Updated list product's property 'deleted': 'true' belongs to this category

    return {
      success: true,
      statusCode: 200,
      data: {
        message: `Category with ID ${id} has been deleted successfully`,
      },
    };
  }
}
