import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { PermissionService } from 'src/modules/permission/permission.service';
import { RoleService } from 'src/modules/role/role.service';
import Redis from 'ioredis';
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //get role from request object
    const { role } = request['user'];
    if (role == 1) return true; //if admin, pass. If not: check permission
    const path = request.route.path;
    const method = request.method;

    const roleCacheKey = `role:${role}:permissions`;
    const permissionCacheKey = `permission:path:${method}:${path}`;

    //get permissionId from cache
    let currentPermissionId: number;
    const cachedPermissionId = await this.redisClient.get(permissionCacheKey);
    if (cachedPermissionId) {
      currentPermissionId = parseInt(cachedPermissionId);
    } else {
      //miss cache, query in db
      currentPermissionId =
        await this.permissionService.getPermissionIdByPathAndMethod(
          path,
          method,
        );
      await this.redisClient.set(
        permissionCacheKey,
        currentPermissionId.toString(),
        'EX',
        3600,
      ); //1hour
    }
    //get permissionIds of role from cache
    let permissionIds: number[] = [];
    const cached = await this.redisClient.get(roleCacheKey);
    if (cached) {
      permissionIds = JSON.parse(cached);
    } else {
      //miss cache, query in db
      permissionIds = await this.roleService.getPermissionIdByRoleId(role);
      await this.redisClient.set(
        roleCacheKey,
        JSON.stringify(permissionIds),
        'EX',
        3600,
      );
    }

    return permissionIds.includes(currentPermissionId);
  }
}
