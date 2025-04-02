
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PermissionService } from 'src/modules/permission/permission.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
  
    private jwtService: JwtService,
    private readonly permissionService: PermissionService,
    

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

    //if role have, return true else return false
 

   
    return true

  }
}

