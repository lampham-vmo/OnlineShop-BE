import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
<<<<<<< HEAD
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService],
=======

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
>>>>>>> product-branch
})
export class CategoryModule {}
