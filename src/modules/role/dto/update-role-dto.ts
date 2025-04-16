import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDTO } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'role id', type: Number })
  id: number;
  @ApiProperty({ required: false, type: String })
  name?: string | undefined;
  @ApiProperty({ required: false, type: String })
  description?: string | undefined;
  @ApiProperty({
    description: 'array of permissionId ',
    example: '[1, 2, 3, 4]',
    type: [Number],
  })
  permissionIds?: [] | undefined;
}
