import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Product } from './Entity/product.entity';
import { ProductRequest } from './DTO/requests/product.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { console } from 'inspector';
import { isNotEmpty } from 'class-validator';
import { ProductResponse } from './DTO/response/product.response';
import { plainToInstance } from 'class-transformer';
import { CategoryResponse } from '../category/dto/response/category.response';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Category)private readonly categoryRepository:Repository<Category>,
        @InjectRepository(Product)private readonly productRepository:Repository<Product>
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
                //handle elasticSearch
                
                //save product then make response
                const savedProduct = await this.productRepository.save(product)
                const categoryRes = plainToInstance(CategoryResponse,savedProduct.category,{excludeExtraneousValues: true})
                const productRes = plainToInstance(ProductResponse,savedProduct,{excludeExtraneousValues: true})
                productRes.category = categoryRes
                productRes.priceAfterDis = await +(await this.priceAfterDis(productRes.price,productRes.discount)).toFixed(0)
                logger.log(productRes)
                return productRes
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
    //TODO: find product search by name(Elastic Search)

    //TODO: get product by paging/detail

    //TODO: alter product
}
