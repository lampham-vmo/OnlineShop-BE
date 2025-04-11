import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class APIResponseDTO<Type> {
  constructor(success: boolean, statusCode: number, data: Type) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  success: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  statusCode: number;

  @IsNotEmpty()
  @ApiProperty()
  data: Type;
}
