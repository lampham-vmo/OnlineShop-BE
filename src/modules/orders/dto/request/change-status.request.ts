import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeStatusRequest {
  @ApiProperty({ type: 'string' })
  @IsString()
  id: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  status: string;
}
