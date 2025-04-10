import { BadRequestException, Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}
      @Get()
      @UseGuards(AuthGuard, RoleGuard)
      async findAll(): Promise<Role[]> {
        return  await this.roleService.getAllRole();
       
      }

      @Post()
      @UseGuards(AuthGuard, RoleGuard)
      async addRole(@Body() createRoleDTO: CreateRoleDTO) : Promise<APIResponseDTO<string> | BadRequestException>{
        console.log(createRoleDTO);
        return await this.roleService.createARole(createRoleDTO)
      }

      @Patch()
      @UseGuards(AuthGuard, RoleGuard)
      async updateRole(@Body() updateRoleDTO: UpdateRoleDTO){
        return await this.roleService.updateARole(updateRoleDTO)
      }

     
}
