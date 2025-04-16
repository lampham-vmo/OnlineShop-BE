import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const refreshToken = this.extractRefreshTokenFromHeader(request);
    const requestUrl = request.url;

    // if url = /auth/refreshAT validate refreshToken

    if (requestUrl === '/api/v1/auth/refreshAT') {
      if (!refreshToken)
        throw new UnauthorizedException('Refresh Token is required!');
      try {
        const payload = await this.validateToken(refreshToken.trim());
        request['user'] = { ...payload, refreshToken: refreshToken };
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid RefreshToken');
      }
    }

    if (token) {
      try {
        const payload = await this.validateToken(token.trim());
        request['user'] = { ...payload, accessToken: token };
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid Accesstoken');
      }
    } else {
      //if token not found
      throw new UnauthorizedException('Invalid Accesstoken');
    }
  }

  async validateToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      algorithms: ['RS256'],
      publicKey: process.env.JWT_PUBLIC_KEY,
    });
    return payload;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    const refreshToken = request.headers['x-refresh-token'] as
      | string
      | undefined;
    return refreshToken;
  }
}
