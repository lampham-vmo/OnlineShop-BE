import { Expose } from "class-transformer";
import { CategoryResponse } from "src/modules/category/dto/response/category.response";
import { Category } from "src/modules/category/entities/category.entity";

export class ProductResponse{
    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    price: number

    @Expose()
    stock: number

    @Expose()
    discount: number

    @Expose()
    image: string

    @Expose()
    priceAfterDis: number

    @Expose()
    category: CategoryResponse | any

    
}