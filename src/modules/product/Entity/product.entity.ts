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
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @IsString({ message: 'Description must be string' })
  @IsNotEmpty()
  @Length(0, 255, { message: 'Name must be less than 255 word' })
  @Expose()
  @Column({ nullable: false })
  name: string;

  @IsString({ message: 'Description must be string' })
  @IsNotEmpty()
  @Length(0, 255, { message: 'Description must be less than 255 word' })
  @Column()
  @Expose()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @Column({ nullable: false })
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @Column({ type: 'float', nullable: false })
  price: number;

  @IsNumber()
  @Expose()
  @Column({ nullable: false })
  discount: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Expose()
  @IsOptional()
  @Column()
  rating: number;

  @IsString()
  @Column()
  @Expose()
  image: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  @Expose()
  createdAt: Timestamp;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Timestamp;
}
