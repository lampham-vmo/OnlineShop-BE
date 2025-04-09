import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from './entities/role.entity';

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}
      @Get()
      @UseGuards(AuthGuard, RoleGuard)
      async findAll(): Promise<Role[]> {
        return  await this.roleService.getAllRole();
       
      }
     
}
