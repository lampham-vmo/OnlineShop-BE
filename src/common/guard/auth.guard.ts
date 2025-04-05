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
    if (requestUrl === '/auth/refreshAT') {
      if (!refreshToken)
        throw new UnauthorizedException('Refresh Token is required!');
      const payload = await this.validateToken(refreshToken.trim());
      request['user'] = { ...payload, refreshToken: refreshToken };
      return true;
    }

    if (token) {
      const payload = await this.validateToken(token.trim());
      //if not throw error (validate success)
      request['user'] = { ...payload, accessToken: token };
      return true;
    }

    return false;
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
    return request.headers['x-refresh-token'] as string | undefined;
  }
}
