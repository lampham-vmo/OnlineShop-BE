import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/modules/auth/auth/dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { SignupResponseDTO } from './dto/signup-response.dto';
import { SignInResponseDTO } from './dto/login-response-dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService,
        private readonly userService: UserService
    ){}

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

    @Post('signup')
    async create(@Body() createUserDTO : CreateUserDTO) : Promise<SignupResponseDTO | BadRequestException>{
        return await this.authService.signup(createUserDTO)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginUserDTO : LoginUserDTO): Promise<SignInResponseDTO | BadRequestException>{
        return await this.authService.signIn(loginUserDTO)
       
    }

}
