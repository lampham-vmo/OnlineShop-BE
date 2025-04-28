import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDTO } from './dto/create-role.dto';
import { BadRequestException } from '@nestjs/common';
import { Permission } from '../permission/entities/permission.entity';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly redisService: RedisService,
  ) {}
  async onModuleInit(): Promise<void> {
    await this.createDefaultRoles();
    await this.assignAllPermissionToAdmin();
  }
  private async assignAllPermissionToAdmin(): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: 1 },
      relations: ['permissions'],
    });
    if (!role) throw new InternalServerErrorException('role not found?');
    const allPermissions = await this.permissionRepository.find();
    role.permissions = allPermissions;
    await this.roleRepository.save(role);
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

  async createARole(newRole: CreateRoleDTO): Promise<string> {
    const { name, description, permissionIds } = newRole;
    const role = new Role();
    role.name = name;
    role.description = description;
    if ((await this.roleRepository.findOne({ where: { name } })) != null) {
      throw new BadRequestException('The role name has already existed');
    } else {
      //if permissionId include
      if (permissionIds) {
        role.permissions = await this.permissionRepository.findBy({
          id: In(permissionIds),
        });
      }
      this.roleRepository.save(role);
      return 'Sucessfully create a role';
    }
  }

  async updateARole(updatedRole: UpdateRoleDTO): Promise<string> {
    const { id } = updatedRole;
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException("The role doesn't exist");
    }

    if (updatedRole.name) {
      const foundRole = await this.roleRepository.findOne({
        where: { name: updatedRole.name },
      });
      if (foundRole && updatedRole.name != role.name) {
        //if found role is another role(different role id but same name)
        throw new BadRequestException('The role name has already existed');
      }

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
    //delete cache
    this.redisService.deleteCacheOfPermissionAndRole();
    return 'Successfully updated a user';
  }

  async getAllRole(): Promise<Role[]> {
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
  async getPermissionByRoleId(roleId: number): Promise<Role | null> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId }, // truyền ID role vào
      relations: ['permissions'],
    });
    return role;
  }

  async getPermissionIdByRoleId(roleId: number): Promise<number[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId }, // truyền ID role vào
      relations: ['permissions'],
    });
    if (!role) return [];
    const permission = role.permissions.map((permission) => permission.id);
    return permission;
  }
}
