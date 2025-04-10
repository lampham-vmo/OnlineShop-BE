import { BadRequestException, Body, Controller, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';
import { ApiProperty } from '@nestjs/swagger';

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}
      @Get()
      @UseGuards(AuthGuard, RoleGuard)
      @ApiProperty()
      async findAll(): Promise<APIResponseDTO<Role[]>> {
        const roles =   await this.roleService.getAllRole();
        return new APIResponseDTO<Role[]>(true, HttpStatus.OK, roles)
      }

      @Post()
      @UseGuards(AuthGuard, RoleGuard)
      @ApiProperty()
      async addRole(@Body() createRoleDTO: CreateRoleDTO) : Promise<APIResponseDTO<string>>{
        const result = await this.roleService.createARole(createRoleDTO)
        return new APIResponseDTO<string>(true, HttpStatus.CREATED, result)
      }

      @Patch()
      @UseGuards(AuthGuard, RoleGuard)
      @ApiProperty()
      async updateRole(@Body() updateRoleDTO: UpdateRoleDTO){
        const result = await this.roleService.updateARole(updateRoleDTO)
        return new APIResponseDTO<string>(true, HttpStatus.CREATED, result)
      }

     
}
