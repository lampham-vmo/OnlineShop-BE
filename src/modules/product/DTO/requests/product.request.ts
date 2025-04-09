import { OmitType } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsNumber } from "class-validator"
import { Product } from "../../Entity/product.entity"
import { ApiProperty } from "@nestjs/swagger"

export class ProductRequest extends OmitType(Product,["category","id","updatedAt","createdAt"]){


    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({description:"category id"})
    categoryId: number


} 