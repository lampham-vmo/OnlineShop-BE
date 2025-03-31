import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { CreateRoleResponseDTO } from './dto/create-role-response.dto';
import { BadRequestException } from '@nestjs/common';

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
        for (const role of roles) {
          const existingRole = await this.roleRepository.findOne({ where: { id: role.id} });
          if (!existingRole) {
            await this.roleRepository.save(role);
            console.log(`✅ Role "${role.name}" created.`);
          }
        }
    }
    
    private async createARole(newRole : CreateRoleDTO) : Promise<CreateRoleResponseDTO | BadRequestException> {
      const isRoleExists = async () => {
        if(newRole.name != null || newRole.description != null){
          return true
        } else if (await this.roleRepository.findOne({where: {name: newRole.name}})){
          return true
        } else {
          return false
        }
      }
      if (await isRoleExists()){
        throw new BadRequestException("The role's name must be unique")
      } else {
        const temp = this.roleRepository.create(newRole)
        await this.roleRepository.save(temp)
        return new CreateRoleResponseDTO(true,200,"Sucessfully created a role")
      }
    }
}