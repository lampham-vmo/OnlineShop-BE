import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  UseGuards,
  Body,
  BadRequestException,
  Req,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import {
  UpdatePasswordDTO,
  UpdateProfileDTO,
  UpdateUserRoleDTO,
} from './dto/update-user-role.dto';
import { GetUserAccountDTO } from './dto/get-user-account.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetAllAccountsFinalResponseDTO } from './dto/user-get-account-success-api-response.dto';
import { UserSuccessMessageFinalResponseDTO } from './dto/user-success-api-response.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { GetProfileResponseDTO, Profile } from './dto/get-profile.response';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @RouteName('Get all user account info')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOkResponse({
    description: 'List of all user accounts',
    type: GetAllAccountsFinalResponseDTO,
  })
  async findAll(): Promise<
    APIResponseDTO<{ accounts: GetUserAccountDTO[]; accountsCount: number }>
  > {
    return await this.userService.getAllAccounts();
  }

  @Get(':id')
  @RouteName('Get an user with an ID')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'User with given ID',
    type: User,
  })
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findOneById(Number(id));
  }

  @Put('profile/:id')
  @RouteName('UPDATE_PROFILE_BY_ID')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Update user profile successfully',
    type: APIResponseDTO<String>,
  })
  async updateProfile(
    @Body() updateProfileDTO: UpdateProfileDTO,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<APIResponseDTO<string> | BadRequestException> {
    const user = req['user'];
    if (id !== user!.id.toString()) {
      throw new BadRequestException('NOT YOUR PROFILE!');
    }
    await this.userService.updateUserProfile(updateProfileDTO, Number(id));
    return new APIResponseDTO<string>(
      true,
      200,
      'Profile updated successfully!',
    );
  }

  @Patch('update-password/:id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'update password success',
    type: APIResponseDTO<Boolean>,
  })
  async updatePassword(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const user = req['user'];
    if (id !== user!.id.toString()) {
      throw new BadRequestException('NOT YOUR PROFILE!');
    }
    const { oldPassword, password, confirmPassword } = updatePasswordDTO;
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'The confirm password must match the password',
      );
    }
    if (password === oldPassword) {
      throw new BadRequestException(
        'The new password must be different from the old password',
      );
    }
    const result = await this.userService.updatePassword(
      user!.id,
      oldPassword,
      password,
    );
    return new APIResponseDTO<boolean>(true, 200, result);
  }

  @Get('profile/:id')
  @RouteName('GET_PROFILE_BY_ID')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Get user profile by ID',
    type: GetProfileResponseDTO,
  })
  async getProfileById(@Param('id') id: string, @Req() req: Request) {
    const user = await this.userService.findOneById(Number(id));
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    //check if the user id in the request matches with the user id in the params
    if (req['user']!.id !== user.id) {
      throw new BadRequestException('NOT YOUR PROFILE!');
    } else {
      const profile = new Profile({
        address: user.address,
        email: user.email,
        fullname: user.fullname,
        phone: user.phone,
        role: user.role,
      });

      return new GetProfileResponseDTO(true, 200, profile);
    }
  }

  @Patch(':id')
  @RouteName('Patch a role for an user')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOkResponse({
    description: 'User role updated successfully',
    type: UserSuccessMessageFinalResponseDTO,
  })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updatedUser: UpdateUserRoleDTO,
  ): Promise<APIResponseDTO<{ message: string }> | BadRequestException> {
    return await this.userService.updateRoleForUser(Number(id), updatedUser);
  }

  @Delete(':id')
  @RouteName('Remove an user account')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: UserSuccessMessageFinalResponseDTO,
  })
  async delete(
    @Param('id') id: string,
  ): Promise<APIResponseDTO<{ message: string }> | BadRequestException> {
    return await this.userService.delete(Number(id));
  }
}
