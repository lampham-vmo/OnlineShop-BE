import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/modules/auth/dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { SignupResponseDTO } from './dto/signup-response.dto';
import { SignInResponseDTO } from './dto/login-response-dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Get('')
  @UseGuards(AuthGuard, RoleGuard)
  get() {}

  @Get('refreshAT')
  @RouteName('refresh access token')
  @UseGuards(AuthGuard, RoleGuard)
  async refreshAcessToken(
    @Req() req: Request,
  ): Promise<object | BadRequestException> {
    const user = req['user'];
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const { refreshToken } = user;
    return await this.authService.handleRefreshAccessToken({
      payload,
      refreshToken,
    });
  }

  @Post('signup')
  @RouteName('signup account')
  async create(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<SignupResponseDTO | BadRequestException> {
    return await this.authService.signup(createUserDTO);
  }

  @Post('login')
  @RouteName('user login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDTO: LoginUserDTO,
  ): Promise<SignInResponseDTO | BadRequestException> {
    return await this.authService.signIn(loginUserDTO);
  }

  @Patch('logout')
  @RouteName('Logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    const user = req['user'];
    return await this.authService.logout(user.id);
  }
}
