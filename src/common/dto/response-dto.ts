import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class APIResponseDTO<Type> {
  constructor(success: boolean, statusCode: number, data: Type) {
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty()
  @IsNotEmpty()
  data: Type;
}
