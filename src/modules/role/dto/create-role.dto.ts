import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../entities/role.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateRoleDTO extends PickType(Role, [
  'name',
  'description',
] as const) {
  @IsOptional() //if permissionIds = undefined, will skip following rules
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'array of permissionId ',
    example: '[1, 2, 3, 4]',
    type: [Number],
  })
  permissionIds?: number[];
}
