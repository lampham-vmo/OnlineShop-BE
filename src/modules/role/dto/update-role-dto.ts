import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDTO } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({required: true, description: "role id"})
    id: number
    @ApiProperty({required: false})
    name?: string | undefined;
    @ApiProperty({required: false})
    description?: string | undefined;
    @ApiProperty({description: "array of permissionId ", example: "[1, 2, 3, 4]"})
    permissionIds?: [] | undefined;
    
}
