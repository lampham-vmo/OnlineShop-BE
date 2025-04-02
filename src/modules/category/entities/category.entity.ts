import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Product } from 'src/modules/product/Entity/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Timestamp, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Category { 
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsOptional()
  @IsString()
  @Column({nullable: true})
  description: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt?: Timestamp
  
  @UpdateDateColumn()
  updatedAt?: Timestamp

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
}
