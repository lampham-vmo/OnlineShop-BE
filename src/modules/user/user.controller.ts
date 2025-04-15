import { Controller, Get, Delete, Patch, Param, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';
import { GetUserAccountDTO } from './dto/get-user-account.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  async findAll(): Promise<APIResponseDTO<{ accounts: GetUserAccountDTO[], accountsCount: number }>> {
    return await this.userService.getAllAccounts();
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findOneById(Number(id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard,RoleGuard)
  async updateUserRole(@Param('id') id: string, @Body() updatedUser: UpdateUserRoleDTO): Promise<APIResponseDTO<{ message: string }> | BadRequestException> {
    return await this.userService.updateRoleForUser(Number(id), updatedUser)
  }

  @Delete(':id')
  @UseGuards(AuthGuard,RoleGuard)
  async delete(@Param('id') id: string): Promise<APIResponseDTO<{ message: string }> | BadRequestException> {
    return await this.userService.delete(Number(id));
  }
}