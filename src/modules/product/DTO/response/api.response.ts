import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ApiResponse<T> {
  @ApiProperty()
  @Expose()
  code: number | 1000;

  @ApiProperty()
  message: string;

  @ApiProperty()
  @Expose()
  result?: T;

  constructor(result?: T, messsage = 'Success', code = 1000) {
    this.code = code;
    this.message = messsage;
    this.result = result;
  }
}
