import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { PermissionService } from '../permission/permission.service';
import { Permission } from '../permission/entities/permission.entity';
import { PermissionModule } from '../permission/permission.module';
import { RoleGuard } from 'src/common/guard/role.guard';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PermissionModule, RoleModule], 
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
