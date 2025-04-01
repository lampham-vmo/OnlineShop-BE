import { Expose } from "class-transformer";
import { ProductResponse } from "./product.response";

export class ProductFindResponse{
    @Expose()
    products: Partial<ProductResponse>[]


    constructor(products: Partial<ProductResponse>[]){
        this.products = products
    }
}