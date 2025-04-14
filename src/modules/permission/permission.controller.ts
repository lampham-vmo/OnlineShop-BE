import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';

@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService){}
    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    async findAll(): Promise<Permission[] | null>{
        return await this.permissionService.getAllPermission()
    }
}
