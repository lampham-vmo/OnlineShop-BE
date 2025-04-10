import { IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class APIResponseDTO<Type> {
  constructor(success: boolean, statusCode: number, data: Type) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }

  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsNotEmpty()
  data: Type;
}
