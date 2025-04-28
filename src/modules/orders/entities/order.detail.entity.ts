import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  @ApiProperty()
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
  quantity: number;

  @ManyToOne(() => Order, (order) => order.order_details)
  @JoinColumn({ name: 'order_id' })
  @Exclude()
  @ApiHideProperty()
  order: Order;

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
