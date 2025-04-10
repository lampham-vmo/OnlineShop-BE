import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [UserModule, JwtModule, PermissionModule, RoleModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
