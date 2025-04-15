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
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty()
  data: Type;
}
