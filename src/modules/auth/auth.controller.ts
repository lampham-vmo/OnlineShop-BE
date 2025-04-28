import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/modules/auth/dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDTO, VerifyEmailDTO } from './dto/create-user.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import {
  AccessTokenDTO,
  LogInResponseDTO,
  RefreshAccessTokenResponseDTO,
  SignUpResponseDto,
  LoginResultDTO,
} from './dto/base-auth-response.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserSuccessMessageFinalResponseDTO } from '../user/dto/user-success-api-response.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import {
  ForgetPassworDTO,
  UpdatePasswordDTO,
} from '../user/dto/update-user-role.dto';

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
    const user = req['user']!;
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

  @Get('resend-confirmation-email/:email')
  @RouteName('RESENT_CONFIRMATION_EMAIL')
  @ApiProperty()
  @ApiOkResponse({
    description: 'resent confirmation email success',
    type: APIResponseDTO<Boolean>,
  })
  async reSendConfirmationEmail(
    @Param('email') email: string,
  ): Promise<APIResponseDTO<Boolean>> {
    const isResendEmail = await this.authService.resendConfirmEmail(email);
    return new APIResponseDTO<boolean>(isResendEmail, HttpStatus.OK, true);
  }

  @Get('confirm/:token')
  @RouteName('CONFIRM_EMAIL')
  @ApiProperty()
  @ApiOkResponse({
    description: 'confirm email success',
    type: APIResponseDTO<Boolean>,
  })
  async confirmEmail(
    @Param('token') token: string,
  ): Promise<APIResponseDTO<Boolean>> {
    const isConfirmEmail = await this.authService.confirmEmail(token);
    return new APIResponseDTO<boolean>(isConfirmEmail, HttpStatus.OK, true);
  }

  @Post('reset-password')
  @RouteName('RESET_PASSWORD')
  @ApiProperty()
  @ApiOkResponse({
    description: 'confirm email success',
    type: APIResponseDTO<Boolean>,
  })
  async resetPassword(
    @Body() verifyEmailDTO: VerifyEmailDTO,
  ): Promise<APIResponseDTO<Boolean>> {
    const result = await this.authService.sendResetPasswordEmail(
      verifyEmailDTO.email,
    );
    return new APIResponseDTO<boolean>(result, HttpStatus.OK, result);
  }

  @Patch('reset-password/confirm/:token')
  @RouteName('CONFIRM_RESET_PASSWORD_TOKEN')
  @ApiProperty()
  @ApiOkResponse({
    description: 'confirm reset password token success',
    type: APIResponseDTO<Boolean>,
  })
  async confirmResetPasswordToken(
    @Param('token') token: string,
    @Body() forgetPasswordDTO: ForgetPassworDTO,
  ): Promise<APIResponseDTO<Boolean>> {
    const result = await this.authService.confirmResetPasswordToken(
      token,
      forgetPasswordDTO.password,
    );
    return new APIResponseDTO<boolean>(result, HttpStatus.OK, result);
  }

  @Post('login')
  @RouteName('user login')
  @ApiProperty()
  @ApiOkResponse({ description: 'login success', type: LogInResponseDTO })
  @ApiBadRequestResponse({ description: 'st wrong' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDTO: LoginUserDTO): Promise<LogInResponseDTO> {
    const { accessToken, refreshToken, permission } =
      await this.authService.signIn(loginUserDTO);
    const token = new LoginResultDTO(accessToken, refreshToken, permission);

    return new LogInResponseDTO(true, HttpStatus.OK, token);
  }

  @Patch('logout')
  @RouteName('Logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    const user = req['user']!;
    return await this.authService.logout(user.id);
  }
}
