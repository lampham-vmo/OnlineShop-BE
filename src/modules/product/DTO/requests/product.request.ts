import { IsInt, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ProductRequest{

    @IsString({message: "Description must be string"})
    @IsNotEmpty()
    @Length(0,255,{message:"Name must be less than 255 word"})
    @ApiProperty({description:"Product name"})
    name: string
 
    @IsString({message: "Description must be string"})
    @IsNotEmpty()
    @Length(0,255,{message: "Description must be less than 255 word"})
    @ApiProperty({description:"Product description"})
    description: string
 
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description:"Product stock"})
    stock: number
 
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description:"Product price"})
    price: number
 
     
    @IsNumber()
    @ApiProperty({description:"Product discount"})
    discount: number
 
    @IsString()
    @ApiProperty({description:"Product image"})
    image: string

    @IsNumber()
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({description:"category id"})
    categoryId: number


}
