import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator'

export class CreateRoleResponseDTO {
    constructor(success: boolean, statusCode: number, message: string){
        this.success = success
        this.statusCode = statusCode
        this.message = message
    }
    @IsBoolean()
    @IsNotEmpty()
    success: boolean;

    @IsNumber()
    @IsNotEmpty()
    statusCode: number;

    @IsNotEmpty()
    @IsString()
    message: string;
}