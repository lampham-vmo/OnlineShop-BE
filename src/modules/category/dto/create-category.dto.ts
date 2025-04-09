<<<<<<< HEAD
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
=======
export class CreateCategoryDto {}
>>>>>>> product-branch
