import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator'

export class SignInResponseDTO {
    constructor(success: boolean, statusCode: number, accessToken: string, refreshToken: string){
        this.success = success;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.statusCode = statusCode
    }
    @IsBoolean()
    @IsNotEmpty()
    success: boolean;

    @IsNumber()
    @IsNotEmpty()
    statusCode: number;

    @IsNotEmpty()
    @IsString()
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}