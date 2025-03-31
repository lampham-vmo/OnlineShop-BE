import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator'

export class SignupResponseDTO {
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