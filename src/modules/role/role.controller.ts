import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiProperty,
} from '@nestjs/swagger';
import {
  AddRoleResponseDto,
  RoleListResponseDto,
  UpdateRoleResponseDto,
} from './dto/response-role.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  @RouteName('admin get all role')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiProperty()
  @ApiOkResponse({
    description: 'get all role success',
    type: RoleListResponseDto,
  })
  async findAll(): Promise<RoleListResponseDto> {
    const roles = await this.roleService.getAllRole();
    return new RoleListResponseDto(true, HttpStatus.OK, roles);
  }

  @Post()
  @RouteName('admin add role')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiProperty()
  @ApiOkResponse({ description: 'add role success', type: AddRoleResponseDto })
  async addRole(
    @Body() createRoleDTO: CreateRoleDTO,
  ): Promise<AddRoleResponseDto> {
    const result = await this.roleService.createARole(createRoleDTO);
    return new AddRoleResponseDto(true, HttpStatus.CREATED, result);
  }

  @Patch()
  @RouteName('admin update role')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiProperty()
  @ApiOkResponse({
    description: 'update role success',
    type: UpdateRoleResponseDto,
  })
  async updateRole(
    @Body() updateRoleDTO: UpdateRoleDTO,
  ): Promise<UpdateRoleResponseDto> {
    const result = await this.roleService.updateARole(updateRoleDTO);
    return new UpdateRoleResponseDto(true, HttpStatus.CREATED, result);
  }
}
