import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';


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
        entities: [User],
        synchronize: true
      })
    }),UserModule,ProductModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
