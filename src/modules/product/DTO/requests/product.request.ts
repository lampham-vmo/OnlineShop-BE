<<<<<<< HEAD
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ProductRequest {
  @IsString({ message: 'Description must be string' })
  @IsNotEmpty()
  @Length(0, 255, { message: 'Name must be less than 255 word' })
  name: string;

  @IsString({ message: 'Description must be string' })
  @IsNotEmpty()
  @Length(0, 255, { message: 'Description must be less than 255 word' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  category: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  image: string;
}
=======
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
>>>>>>> product-branch
