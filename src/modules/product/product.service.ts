import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './Entity/product.entity';
import { ProductRequest } from './DTO/requests/product.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { ProductResponse } from './DTO/response/product.response';
import { plainToInstance } from 'class-transformer';
import { SearchService } from './search.service';
import { ProductPagingResponse } from './DTO/response/product.paging.response';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly esService: SearchService,
    private readonly dataSource: DataSource,
  ) {}

  //simulate rating
  private randomRating(): number {
    return Math.floor(Math.random() * 5) + 1;
  }

  private priceAfterDis(price: number, discount: number) {
    return price - (price * discount) / 100;
  }
  //TODO: create product
  async createProduct(
    productRequest: ProductRequest,
  ): Promise<ProductResponse> {
    const category = await this.categoryRepository.findOneBy({
      id: productRequest.categoryId,
      deleted: false,
    });
    const product = await this.productRepository.exists({
      where: { name: productRequest.name, isDeleted: false },
    });
    if (productRequest) {
      if (category !== null) {
        if (!product) {
          const product = this.productRepository.create({
            name: productRequest.name,
            description: productRequest.description,
            stock: productRequest.stock,
            price: productRequest.price,
            discount: productRequest.discount,
            rating: this.randomRating(),
            image: productRequest.image,
            category: category,
          });
          const proLog = await this.createProductAndSync(product);
          return proLog;
        } else {
          throw new BadRequestException({ message: 'Product is exited!' });
        }
      } else {
        throw new BadRequestException({ message: 'Category not Exits' });
      }
    } else {
      throw new BadRequestException({ message: 'Product data is not valid!' });
    }
  }

  private makeProductRes(product: Product) {
    const productRes = plainToInstance(ProductResponse, product, {
      excludeExtraneousValues: true,
    });
    productRes.priceAfterDis = parseInt(
      this.priceAfterDis(productRes.price, productRes.discount).toFixed(0),
    );
    if (product.category === null) {
      productRes.categoryName = null;
    } else {
      productRes.categoryName = product.category.name;
    }
    return productRes;
  }

  private async updateProductAndSync(id: number, updateData: Product) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Product, { id }, updateData);
      const updatedProduct = await queryRunner.manager.findOne(Product, {
        where: { id: id, isDeleted: false },
      });
      if (!updatedProduct) {
        throw new BadRequestException('Nothing to updated!');
      }
      let productRes = this.makeProductRes(updateData);
      try {
        await this.esService.updateProductPartial(id, productRes);
      } catch (error) {
        throw new BadRequestException('Error when update Elastic');
      }
      await queryRunner.commitTransaction();
      return productRes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // delete product and sync
  private async deleteProductAndSync(id: number): Promise<ProductResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: id, isDeleted: false },
        relations: ['category'],
      });
      if (!product) {
        throw new NotFoundException('Product not found!');
      }
      await queryRunner.manager.update(Product, { id }, { isDeleted: true });
      let productRes = this.makeProductRes(product);
      try {
        await this.esService.removeProduct(id);
      } catch (error) {
        throw new BadRequestException(error);
      }
      await queryRunner.commitTransaction();
      return productRes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  // create product and async
  private async createProductAndSync(
    productData: Product,
  ): Promise<ProductResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newProduct = queryRunner.manager.create(Product, productData);
      await queryRunner.manager.save(newProduct);
      let productRes = this.makeProductRes(newProduct);
      try {
        await this.esService.indexProduct(productRes);
      } catch (error) {
        throw new BadRequestException(error);
      }
      await queryRunner.commitTransaction();
      return productRes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
  //delete Product follow category and asyns
  async alterProductWithCategoryAndSync(categoryId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const categoryName = await queryRunner.manager.findOne(Category, {
        where: { id: categoryId },
      });
      if (!categoryName) {
        throw new BadRequestException('category not found');
      }
      await queryRunner.manager.update(
        Category,
        { id: categoryId },
        { deleted: true },
      );
      await queryRunner.manager.update(
        Product,
        { category: { id: categoryId } },
        { category: null as any },
      );
      try {
        await this.esService.updateCategoryNameToNullInES(categoryName.name);
      } catch (error) {
        throw new BadRequestException(error);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  //TODO: find product search by name(Elastic Search)
  async findProductBySearch(text: string): Promise<ProductResponse[]> {
    try {
      const result = await this.esService.findProductForSearchBar(text);
      return result;
    } catch (error) {
      throw new BadRequestException({ message: 'Error when find Product!' });
    }
  }
  //TODO: get product by paging/detail
  async GetProductPagination(
    text: string,
    page: number,
    orderField: string,
    orderBy: string,
  ): Promise<ProductPagingResponse> {
    try {
      const result = await this.esService.findProductForPaging(
        text,
        page,
        orderField,
        orderBy,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  //TODO: update product
  async UpdateProduct(
    id: number,
    productUpdateDto: ProductRequest,
  ): Promise<ProductResponse> {
    const productExits = await this.productRepository.exists({
      where: { id: id, isDeleted: false },
    });
    const category = await this.categoryRepository.findOneBy({
      id: productUpdateDto.categoryId,
      deleted: false,
    });
    if (!productExits) {
      throw new BadRequestException({ message: 'Product not exits!' });
    }
    if (!category) {
      throw new BadRequestException({ message: 'Category not found!' });
    }
    const product = plainToInstance(Product, productUpdateDto, {
      excludeExtraneousValues: true,
    });
    product.category = category;
    if (productExits) {
      const productRes = await this.updateProductAndSync(id, product);
      return productRes;
    } else {
      throw new NotFoundException({ message: 'Product not found!' });
    }
  }

  async deleteProduct(id: number): Promise<string> {
    const product = await this.deleteProductAndSync(id);
    return `Product with id: ${product.id} and product name: ${product.name} is deleted!`;
  }

  async getProductById(id: number): Promise<ProductResponse> {
    const product = await this.productRepository.findOne({
      where: { id: id, isDeleted: false },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException({ message: 'Product not found!' });
    }
    const productRes = this.makeProductRes(product);
    return productRes;
  }

  //TODO: read product
  async GetAllProductPaging(
    page: number = 1,
    orderField: string = 'createdAt',
    orderBy: string = 'DESC',
    pageSize: number = 10,
    categoryId?: number,
  ): Promise<ProductPagingResponse> {
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isDeleted = false');

    // Nếu có categoryId thì lọc theo id hoặc category null
    if (categoryId) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('category.id = :categoryId', { categoryId }).orWhere(
            'product.category IS NULL',
          );
        }),
      );
    }

    const [products, totalItems] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .orderBy(`product.${orderField}`, orderBy.toUpperCase() as 'ASC' | 'DESC')
      .getManyAndCount();

    const transformed = plainToInstance(
      ProductResponse,
      products.map((p) => ({
        ...p,
        priceAfterDis: p.price - (p.price * p.discount) / 100,
        categoryName: p.category?.name,
      })),
      { excludeExtraneousValues: true },
    );

    const pagination = {
      currentPage: +page,
      pageSize: pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems: totalItems,
    };

    return new ProductPagingResponse(transformed, pagination);
  }
}
