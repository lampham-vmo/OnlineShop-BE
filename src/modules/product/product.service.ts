import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Product } from './Entity/product.entity';
import { ProductRequest } from './DTO/requests/product.request';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { console } from 'inspector';
import { isNotEmpty } from 'class-validator';
import { ProductResponse } from './DTO/response/product.response';
import { plainToInstance } from 'class-transformer';
import { CategoryResponse } from '../category/dto/response/category.response';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Category)private readonly categoryRepository:Repository<Category>,
        @InjectRepository(Product)private readonly productRepository:Repository<Product>,
        private readonly esService: SearchService,
        private readonly dataSource:DataSource
    ){};

    //simulate rating 
    async randomRating(){
        return Math.floor(Math.random() * 5)+1;
    }

    async priceAfterDis(price: number,discount: number){
        return price - ((price * discount)/100)
    }
    //TODO: create product
    async createProduct(productRequest:ProductRequest): Promise<ProductResponse|undefined>{
        const category = await this.categoryRepository.findOneBy({id: productRequest.category})
        const product = await this.productRepository.exists({where:{name: productRequest.name}})
        const logger = new Logger('ProductService'); 

        if(productRequest){
            if(!product){
                if(category !== null){
                    const product = this.productRepository.create({
                        name: productRequest.name,
                        description: productRequest.description,
                        stock: productRequest.stock,
                        price: productRequest.price,
                        discount: productRequest.discount,
                        rating: await this.randomRating(),
                        image: productRequest.image,
                        category: category
                    })
                const proLog = await this.createProductAndSync(product)
                logger.log(proLog)
                return proLog
                } else{
                    throw new BadRequestException({message: "Category not Exits"})
                }
            } else{
                throw new BadRequestException({message:"product is exited!"})
            }
        }else{
            throw new BadRequestException({message:"Product data is not valid!"})
        }
    }

    async makeProductRes(product: Product){
        const categoryRes = plainToInstance(CategoryResponse,product.category,{excludeExtraneousValues: true})
        const productRes = plainToInstance(ProductResponse,product,{excludeExtraneousValues: true})
        productRes.category = categoryRes
        productRes.priceAfterDis = await +(await this.priceAfterDis(productRes.price,productRes.discount)).toFixed(0)
        return productRes;
    }

    async updateProductAndSync(id: number, updateData: Partial<Product>) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
          // 🔹 Cập nhật dữ liệu trong Database
          await queryRunner.manager.update(Product, { id }, updateData);
          const updatedProduct = await queryRunner.manager.findOne(Product, { where: { id } });
    
          // 🔹 Commit DB trước khi cập nhật Elasticsearch
          
          // 🔹 Cập nhật vào Elasticsearch
          //await this.esService.
          
          await queryRunner.commitTransaction();
          return updatedProduct;
        } catch (error) {
          await queryRunner.rollbackTransaction(); // Rollback nếu có lỗi
          throw error;
        } finally {
          await queryRunner.release();
        }
      }

    async createProductAndSync(productData: Product) {
        const logger = new Logger('ProductService'); 
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
          const newProduct = queryRunner.manager.create(Product, productData);
          await queryRunner.manager.save(newProduct);
          logger.log("saving.....")
          let productRes = await this.makeProductRes(newProduct)
          productRes ={
            ...productRes,
                category: productRes.category.name
            }
          logger.log(productRes)
          await this.esService.indexProduct(productRes)
          await queryRunner.commitTransaction();
          return productRes;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error
        } finally {
          await queryRunner.release();
        }
      }
      //TODO: find product search by name(Elastic Search)
      async findProductBySearch(text: string): Promise<Partial<ProductResponse>[]>{
        try{
            const result = await this.esService.findProduct(text);
            return result;
        } catch(error){
            Logger.log(error)
            throw new BadRequestException({message: "Error when find Product!"})
        }
      }
      //TODO: get product by paging/detail
  
      //TODO: alter product
}


    

