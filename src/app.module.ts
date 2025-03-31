import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { AuthModule } from './modules/auth/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config)=>({
        type: 'postgres',
        host: 'localhost',
        port: config.get("database.port"),
        username:'postgres',
        password: config.get("database.password"),
        database: config.get("database.DB"),
        autoLoadEntities: true,
        synchronize: true
      })
    }),UserModule,ProductModule, AuthModule, RoleModule, PermissionModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
