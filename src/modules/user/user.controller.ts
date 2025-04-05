import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from '../auth/auth/dto/create-user.dto';
import { GetUserDTO } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOneById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findOneById(Number(id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return await this.userService.delete(Number(id));
  }
}
