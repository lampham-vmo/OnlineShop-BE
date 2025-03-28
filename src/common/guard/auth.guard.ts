
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
  
    private jwtService: JwtService

  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('token not found!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          algorithms: ['RS256'],
          publicKey: process.env.JWT_PUBLIC_KEY
        }
      );
      console.log(payload);
      request['user'] = payload

    } catch (err) {
      throw new UnauthorizedException(err)
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }
}

