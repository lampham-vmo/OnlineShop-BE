import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class BaseResponseDTO {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  constructor(success: boolean, statusCode: number, message: string) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
  }
}
