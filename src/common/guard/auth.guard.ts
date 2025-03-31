
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
    const refreshToken = this.extractRefreshTokenFromHeader(request);
    const requestUrl = request.url; 

    // if url = /auth/refreshAT by pass validate access token
    if (requestUrl === '/auth/refreshAT') {
    //mission of RT only to refresh accessToken => don't need validate at AuthGuard, validate at handleRefreshAT
      if (!refreshToken) throw new UnauthorizedException('Refresh Token is required!');
      request['refreshToken'] = refreshToken;
      return true;
    }
    //mission of AT is validate => need validate
    try{
      if (token) {
        const payload = await this.validateToken(token)
        request['user'] = payload;
      }
    }catch(err){
   
      throw new BadRequestException('invalid Accesstoken')
    }
  
 
    return true
  }

  async validateToken(token: string) {
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        algorithms: ['RS256'],
        publicKey: process.env.JWT_PUBLIC_KEY
      }
    );
    return payload

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    return request.headers['x-refresh-token'] as string | undefined;
  }
}

