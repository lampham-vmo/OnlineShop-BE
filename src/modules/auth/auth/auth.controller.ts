import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/modules/user/dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Get('refreshAT')
    @UseGuards(AuthGuard)
    async refreshAcessToken(@Req() req: Request){
        const refreshToken = req['refreshToken']
        if(!refreshToken) throw new BadRequestException('RT not found!')
        const accessToken = await this.authService.handleRefreshAccessToken(refreshToken)
        return {
            accessToken
        }

    }

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
