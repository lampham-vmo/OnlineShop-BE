import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}
  async deleteCacheOfPermissionAndRole() {
    const roleKeys = await this.redisClient.keys('role:*');
    const permissionKeys = await this.redisClient.keys('permission:path:*');

    const allKeys = [...roleKeys, ...permissionKeys];

    if (allKeys.length) {
      await this.redisClient.del(...allKeys);
    }
  }
}
