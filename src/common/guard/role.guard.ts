
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
  
    private jwtService: JwtService

  ) { }



  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //get role from request object
    const {role} = request["user"]
    if(role == 1 ) return true //if admin, pass. If not: check permission
    //get permissionId with corresponding path and method 
    const path = request.route.path
    const method = request.method
    console.log(path, method);
    

    //check if role had this permissionid 

    //permission url  voi ca url input 

    //return true

    //


  }
}

