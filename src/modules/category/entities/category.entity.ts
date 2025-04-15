import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Product } from 'src/modules/product/Entity/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @Expose()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(0, 50, { message: 'Name must be less than 50 characters' })
  @IsNotEmpty()
  @Column()
  name: string;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  @IsString()
  @Length(0, 255, { message: 'Name must be less than 255 characters' })
  @Column({ default: '' })
  description: string;

  @Expose()
  @ApiProperty()
  @Column({ default: false })
  deleted: boolean;

  @Expose()
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
