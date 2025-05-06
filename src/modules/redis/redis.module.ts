import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
            ? parseInt(process.env.REDIS_PORT)
            : 6379,
          password: process.env.REDIS_PASSWORD,
          username: process.env.REDIS_USER || 'default', // Redis trên Railway mặc định là "default"
        });
      },
    },
  ],
  exports: [RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
