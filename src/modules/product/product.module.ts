import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './Entity/product.entity';
import { Category } from '../category/entities/category.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category,Product]),
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (configService:ConfigService)=>({
        node: configService.get("elastic.node"),
        maxRetries: 10,
        requestTimeout: 60000,
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
