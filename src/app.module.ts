import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config) => ({
        type: 'postgres',
        host: 'localhost',
        port: config.get('database.port'),
        username: 'postgres',
        password: config.get('database.password'),
        database: config.get('database.DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
