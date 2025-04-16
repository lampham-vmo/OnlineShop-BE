import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async getAllPermission(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async getPermissionIdByPathAndMethod(
    path: string,
    method: string,
  ): Promise<number> {
    const permission = await this.permissionRepository.findOne({
      where: [{ path: path, method: method }],
    });
    if (!permission)
      throw new InternalServerErrorException('Permission not found !');
    return permission.id;
  }
  async syncPermissions(
    routes: { name: string; path: string; method: string }[],
  ) {
    for (const route of routes) {
      // check permission exists?
      let permission = await this.permissionRepository.findOne({
        where: [
          { name: route.name }, // check if same name
          { path: route.path, method: route.method }, // or same "path and method"
        ],
      });

      if (!permission) {
        //create new permission
        permission = this.permissionRepository.create({
          name: route.name,
          path: route.path,
          method: route.method,
        });
      } else {
        // if permission exists, check path, method, name whether it changed or not?
        const isUpdated =
          permission.path !== route.path ||
          permission.method !== route.method ||
          permission.name !== route.name;

        if (isUpdated) {
          //if changed, update permission
          permission.name = route.name;
          permission.path = route.path;
          permission.method = route.method;
        }
      }
      //save permission
      await this.permissionRepository.save(permission);
    }
  }
}
