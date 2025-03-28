import { IsEmail, IsNumber, IsNotEmpty } from 'class-validator'

export class LoginResponseDTO {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    role_id: number
}