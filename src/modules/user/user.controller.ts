import { Controller, Get, Delete, Param, UseGuards, BadGatewayException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AccountsRO } from './user.interface';
import { APIResponseDTO } from 'src/common/interface/response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  async findAll(): Promise<AccountsRO> {
    return await this.userService.getAllAccounts();
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findOneById(Number(id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<APIResponseDTO<string>|BadRequestException> {
    return await this.userService.delete(Number(id));
  }
}