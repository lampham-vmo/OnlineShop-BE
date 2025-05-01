import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { CartProduct } from 'src/modules/cart/entities/cart_product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Expose()
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @IsString()
  @Expose()
  @IsNotEmpty()
  @Length(1, 255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: 'Product name (e.g., CPU, GPU, RAM, etc.)',
    maxLength: 255,
    example: 'Intel Core i9-13900K',
    nullable: false,
    type: 'string',
    minLength: 1,
  })
  @Column({ nullable: false })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty({
    description: 'Short product description',
    maxLength: 255,
    example: 'High-end 13th Gen Intel processor for gamers and creators.',
    type: 'string',
    minLength: 1,
    nullable: false,
  })
  @Column()
  @Expose()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @Min(1)
  @ApiProperty({
    description: 'Stock quantity available',
    minimum: 0,
    example: 50,
    type: 'number',
    nullable: false,
  })
  @Column({ nullable: false })
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Expose()
  @ApiProperty({
    description: 'Product price in USD',
    minimum: 0,
    example: 599.99,
    type: 'number',
    nullable: false,
  })
  @Column({ type: 'float', nullable: false })
  price: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Expose()
  @ApiProperty({
    description: 'Discount percentage (0-100)',
    minimum: 0,
    maximum: 100,
    example: 15,
    nullable: false,
    type: 'number',
  })
  @Column({ nullable: false })
  discount: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @ApiProperty({
    description: 'Is product marked as deleted?',
    default: false,
    example: false,
    type: 'boolean',
  })
  @Column({ default: false })
  isDeleted: boolean;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Expose()
  @IsOptional()
  @ApiProperty({
    description: 'Average customer rating (0.0 - 5.0)',
    minimum: 0,
    maximum: 5,
    example: 4.7,
    nullable: true,
  })
  @Column({ nullable: true })
  rating: number;

  @IsString()
  @ApiProperty({
    description: 'URL of product image',
    example: 'https://cdn.example.com/products/intel-i9.jpg',
    type: 'string',
    nullable: false,
  })
  @Expose()
  @Column()
  image: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  @Expose()
  @ApiProperty({
    type: () => Category,
    description: 'Product category (e.g., CPU, GPU, RAM, etc.)',
    nullable: true,
  })
  category: Category;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Exclude()
  @IsOptional()
  @ApiHideProperty()
  cartProducts: CartProduct[];

  @CreateDateColumn()
  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Creation timestamp',
    example: '2025-04-12T10:00:00Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Last update timestamp',
    example: '2025-04-12T11:00:00Z',
  })
  updatedAt: Date;
}
