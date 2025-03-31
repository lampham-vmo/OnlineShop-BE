import {
    IsString,
    IsNotEmpty,
} from 'class-validator'
import { Permission } from 'src/modules/permission/entities/permission.entity';

export class CreateRoleDTO {
    constructor(name: string, description: string, permissions: Permission[]) {  // Constructor
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    readonly permissions: Permission[];
}