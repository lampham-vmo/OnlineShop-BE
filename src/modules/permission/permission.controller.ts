import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { GetPermissionResponseDTO } from './dto/base-permission-response.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @Get()
  @RouteName('get all permission')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiProperty()
  @ApiOkResponse({
    description: 'get role success',
    type: GetPermissionResponseDTO,
  })
  async findAll(): Promise<GetPermissionResponseDTO> {
    const result = await this.permissionService.getAllPermission();
    return new GetPermissionResponseDTO(true, HttpStatus.OK, result);
  }
}
