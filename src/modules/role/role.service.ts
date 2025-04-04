import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { BadRequestException } from '@nestjs/common';
import { Permission } from '../permission/entities/permission.entity';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async onModuleInit(): Promise<void> {
    await this.createDefaultRoles();
  }

  private async createDefaultRoles(): Promise<void> {
    const roles = [
      { id: 1, name: 'admin', description: 'Administrator role' },
      { id: 2, name: 'user', description: 'Regular user role' },
    ];
    for (const role of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { id: role.id },
      });
      if (!existingRole) {
        await this.roleRepository.save(role);
        console.log(`✅ Role "${role.name}" created.`);
      }
    }
  }

  async createARole(
    newRole: CreateRoleDTO,
  ): Promise<APIResponseDTO<string> | BadRequestException> {
    const { name, description, permissionIds } = newRole;
    const role = new Role();
    role.name = name;
    role.description = description;
    if ((await this.roleRepository.findOne({ where: { name } })) != null) {
      throw new BadRequestException('The role name has already existed');
    } else {
      if (permissionIds && permissionIds.length > 0) {
        role.permissions = await this.permissionRepository.findBy({
          id: In(permissionIds),
        });
        this.roleRepository.save(role);
      } else {
        throw new BadRequestException('The permissionsIDs must not be blank');
      }
      return new APIResponseDTO(true, 200, 'Sucessfully create a role');
    }
  }

  async updateARole(
    id: number,
    updatedRole: UpdateRoleDTO,
  ): Promise<APIResponseDTO<string> | BadRequestException> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException("The role doesn't exist");
    }
    if (updatedRole.name) {
      role.name = updatedRole.name;
    }
    if (updatedRole.description) {
      role.description = updatedRole.description;
    }
    if (updatedRole.permissionIds) {
      role.permissions = await this.permissionRepository.find({
        where: {
          id: In(updatedRole.permissionIds),
        },
      });
    }
    await this.roleRepository.save(role);
    return new APIResponseDTO<string>(true, 200, 'Successfully updated a user');
  }

  async getAllRole(): Promise<Role[] | BadRequestException> {
    const result = await this.roleRepository.find({
      relations: { permissions: true },
    });
    if (!result) {
      throw new BadRequestException('No roles are found');
    } else {
      return result;
    }
  }

  async getARoleByID(id: number): Promise<Role | BadRequestException> {
    const result = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!result) {
      throw new BadRequestException('No role is fund by id');
    } else {
      return result;
    }
  }
  async isRoleHasPermissionId(
    roleId: number,
    permissionId: number,
  ): Promise<boolean> {
    const query = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!query) {
      return false;
    }
    return query.permissions.some(
      (permission) => permission.id == permissionId,
    );
  }
}
