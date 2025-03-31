import {
    IsString,
    IsNotEmpty,
} from 'class-validator'

export class CreateRoleDTO {
    constructor(name: string, description: string) {  // Constructor
        this.name = name;
        this.description = description;
    }
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}