import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { And, Repository } from 'typeorm';


@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) { }

    async syncPermissions(routes: {name: string, path: string; method: string }[]) {
        for (const route of routes) {
            // check permission exists?
            let permission = await this.permissionRepository.findOne({
                where: [
                    { name: route.name },  // check if same name 
                    { path: route.path, method: route.method }  // or same "path and method"
                ]
            });

            if (!permission) {
                //create new permission
                permission = this.permissionRepository.create({
                    name: route.name,
                    path: route.path,
                    method: route.method,
                });
            }else{
                // if permission exists, check path and method whether it changed or not? 
                const isUpdated = permission.path !== route.path || permission.method !== route.method || permission.name !== route.name;
                
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
