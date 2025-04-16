import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/modules/auth/dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AccessTokenDTO, LogInResponseDTO, RefreshAccessTokenResponseDTO, SignUpResponseDto, LoginResultDTO } from './dto/base-auth-response.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserSuccessMessageFinalResponseDTO } from '../user/dto/user-success-api-response.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('refreshAT')
  @RouteName('refresh access token')
  @ApiProperty()
  @ApiOkResponse({
    description: 'refresh access token success',
    type: RefreshAccessTokenResponseDTO,
  })
  @UseGuards(AuthGuard, RoleGuard)
  async refreshAcessToken(
    @Req() req: Request,
  ): Promise<RefreshAccessTokenResponseDTO> {
    const user = req['user'];
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const { refreshToken } = user;
    const accessToken = await this.authService.handleRefreshAccessToken({
      payload,
      refreshToken,
    });

    const accessTokenDTO = new AccessTokenDTO(accessToken);
    return new RefreshAccessTokenResponseDTO(
      true,
      HttpStatus.CREATED,
      accessTokenDTO,
    );
  }

  @Post('signup')
  @RouteName('signup account')
  @ApiProperty()
  @ApiOkResponse({
    description: 'User role updated successfully',
    type: UserSuccessMessageFinalResponseDTO,
  })
  async create(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    return await this.authService.signup(createUserDTO);
  }

  @Post('login')
  @RouteName('user login')
  @ApiProperty()
  @ApiOkResponse({ description: 'login success', type: LogInResponseDTO })
  @ApiBadRequestResponse({ description: "st wrong" })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDTO: LoginUserDTO,
  ): Promise<LogInResponseDTO> {
    const { accessToken, refreshToken, permission } = await this.authService.signIn(loginUserDTO);
    const token = new LoginResultDTO(accessToken, refreshToken, permission)

    return new LogInResponseDTO(true, HttpStatus.OK, token)

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
