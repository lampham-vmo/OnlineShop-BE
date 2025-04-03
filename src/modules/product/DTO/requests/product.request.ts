import { OmitType } from "@nestjs/mapped-types"
import { IsInt, IsNotEmpty, IsNumber } from "class-validator"
import { Product } from "../../Entity/product.entity"

export class ProductRequest extends OmitType(Product,["category","id","updatedAt","createdAt"]){

    
    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    categoryId: number

}