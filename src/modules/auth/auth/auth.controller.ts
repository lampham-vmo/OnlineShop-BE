import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/modules/user/dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginUserDTO : LoginUserDTO){
        const keyPair =  await this.authService.signIn(loginUserDTO)
        const {accessToken, refreshToken} = keyPair

       
        return {
            accessToken,
            refreshToken,
            success: "true"
            
        }
    }

}
