import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService implements OnModuleInit {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ){}
    async onModuleInit() : Promise<void>{
        await this.createDefaultRoles()
    }

    private async createDefaultRoles() : Promise<void>{
        const roles = [
          { id: 1, name: 'admin', description: 'Administrator role' },
          { id: 2, name: 'user', description: 'Regular user role' },
        ];
        //if role not exists, create default roles
        for (const role of roles) {
          const existingRole = await this.roleRepository.findOne({ where: { id: role.id } });
          if (!existingRole) {
            await this.roleRepository.save(role);
            console.log(`✅ Role "${role.name}" created.`);
          }
        }
    }
}
