import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../role/entities/role.entity';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role]), RedisModule],
  controllers: [PermissionController],
  providers: [PermissionService, JwtService, RoleService],
  exports: [PermissionService],
})
export class PermissionModule {}
