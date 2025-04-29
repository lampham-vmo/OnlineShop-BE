import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { plainToInstance } from 'class-transformer';
import {
  CategoryPaginationData,
  CategoryQueryDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private productService: ProductService,
  ) {}

  private transformToDTO<T, V>(
    classType: new () => T,
    plainData: V | V[],
  ): T | T[] {
    return plainToInstance(classType, plainData, {
      excludeExtraneousValues: true,
    });
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<APIResponseDTO<CategoryResponseDto>> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, deleted: false },
    });
    if (existingCategory) {
      throw new BadRequestException({
        message: `Category name existed`,
      });
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    const result = await this.categoryRepository.save(newCategory);

    return {
      success: true,
      statusCode: 201,
      data: this.transformToDTO(
        CategoryResponseDto,
        result,
      ) as CategoryResponseDto,
    };
  }

  async getListCategory(): Promise<APIResponseDTO<CategoryResponseDto[]>> {
    const categories = await this.categoryRepository.find({
      where: {
        deleted: false,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      success: true,
      statusCode: 200,
      data: this.transformToDTO(
        CategoryResponseDto,
        categories,
      ) as Array<CategoryResponseDto>,
    };
  }

  async getListCategoryWithPagination(
    query: CategoryQueryDto,
  ): Promise<APIResponseDTO<CategoryPaginationData>> {
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
      queryBuilder.andWhere(`category.name LIKE :name`, {
        name: `%${search}%`,
      });
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

  async getOneCategoryWithId(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, deleted: false },
    });
    if (!category) {
      throw new NotFoundException({
        message: `Category with ID ${id} not found`,
      });
    }
    return category;
  }

  async findOneCategoryById(id: number): Promise<APIResponseDTO<Category>> {
    const category = await this.getOneCategoryWithId(id);
    return {
      success: true,
      statusCode: 200,
      data: category,
    };
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<APIResponseDTO<Category> | BadRequestException> {
    await this.getOneCategoryWithId(id);

    if (updateCategoryDto.name) {
      const duplicateCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name, id: Not(id), deleted: false },
      });

      if (duplicateCategory) {
        throw new BadRequestException({
          message: 'Category name already exists',
        });
      }
    }

    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      return await this.findOneCategoryById(id);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async deleteCategory(id: number): Promise<APIResponseDTO<string>> {
    await this.getOneCategoryWithId(id);

    // TODO: Updated list product's property 'deleted': 'true' belongs to this category

    await this.productService.alterProductWithCategoryAndSync(id);

    return {
      success: true,
      statusCode: 200,
      data: `Category with ID ${id} has been deleted successfully`,
    };
  }
}
