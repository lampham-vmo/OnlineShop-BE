import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @IsString({ message: 'Name must be string' })
  @IsNotEmpty()
  @Length(0, 255, { message: 'Name must be less than 255 word' })
  @Expose()
  @Transform(({value})=>typeof value === "string"? value.trim():value)
  @ApiProperty({ description: 'Product name' })
  @Column({ nullable: false })
  name: string;

  @IsString({ message: 'Description must be string' })
  @IsNotEmpty()
  @Length(0, 255, { message: 'Description must be less than 255 word' })
  @Column()
  @ApiProperty({ description: 'Product description' })
  @Expose()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: 'Product stock' })
  @Column({ nullable: false })
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: 'Product price' })
  @Column({ type: 'float', nullable: false })
  price: number;

  @IsNumber()
  @Expose()
  @ApiProperty({ description: 'Product discount' })
  @Column({ nullable: false })
  discount: number;

  @IsOptional()
  @ApiProperty({ description: 'Deleted or not' })
  @Column({ default: false })
  isDeleted: boolean;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Expose()
  @IsOptional()
  @ApiProperty({ description: 'Product rating' })
  @Column()
  rating: number;

  @IsString()
  @Column()
  @ApiProperty({ description: 'Product image' })
  @Expose()
  image: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty()
  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
