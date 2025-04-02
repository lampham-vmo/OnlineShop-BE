import { Module, OnModuleInit, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PermissionService } from './modules/permission/permission.service';
import { Permission } from './modules/permission/entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';

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
      useFactory: async (config) => ({
        type: 'postgres',
        host: 'localhost',
        port: config.get("database.port"),
        username: 'postgres',
        password: config.get("database.password"),
        database: config.get("database.DB"),
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    TypeOrmModule.forFeature([Permission]),
    UserModule, ProductModule, AuthModule, RoleModule, PermissionModule, JwtModule

  ],
  controllers: [AppController],
  providers: [AppService, DiscoveryService, MetadataScanner, PermissionService],

})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService
  ) {

  }

  onModuleInit() {
   this.getAllRouteAndInsertIntoPermission()
  }


  getAllRouteAndInsertIntoPermission(){
    const controllers = this.discoveryService.getControllers();
    const routes: { name: string, path: string; method: string }[] = [];

    const methodMap = {
      [RequestMethod.GET]: 'GET',
      [RequestMethod.POST]: 'POST',
      [RequestMethod.PUT]: 'PUT',
      [RequestMethod.DELETE]: 'DELETE',
      [RequestMethod.PATCH]: 'PATCH',
    };
    //loop through all controller to get route
    for (const controller of controllers) {
      if (!controller.metatype) continue;

      const instance = controller.instance;
      const prototype = Object.getPrototypeOf(instance);
      const controllerPath = Reflect.getMetadata('path', controller.metatype);
      const basePath = controllerPath ? `/${controllerPath}` : '';
      //scan to get each path, method
      this.metadataScanner.scanFromPrototype(instance, prototype, (method) => {
        if (!prototype[method]) return;
        
        const methodPath = Reflect.getMetadata('path', prototype[method]) || '';
        const methodType = Reflect.getMetadata('method', prototype[method]);
        const routeName = Reflect.getMetadata('routeName', prototype[method])
        if (methodType !== undefined) {
          //path:  /something/something
          let fullPath = `${basePath}/${methodPath}`.replace(/\/+/g, '/');
          if (fullPath != '/') {
            fullPath = fullPath.replace(/\/+$/, '');
          }
          routes.push({
            name: routeName,
            path: fullPath,
            method: methodMap[methodType] || 'UNKNOWN',
          });
        }
      });
    }
    console.log("all route: ", routes);
    //sync permission in db every time app run
    this.permissionService.syncPermissions(routes);
  }
}