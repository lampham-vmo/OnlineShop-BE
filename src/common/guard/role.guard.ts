import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { PermissionService } from 'src/modules/permission/permission.service';
import { RoleService } from 'src/modules/role/role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //get role from request object
    const {role} = request["user"]
    if(role == 1 ) return true //if admin, pass. If not: check permission
    //get permissionId with corresponding path and method 
    const path = request.route.path
    const method = request.method
    const permissionId = await this.permissionService.getPermissionIdByPathAndMethod(path, method)
    //check if role has this permissionid 
    const isRoleHasPermissionId = await this.roleService.isRoleHasPermissionId(role,permissionId)
    //if role have, return true else return false   
    return isRoleHasPermissionId
  }
}
