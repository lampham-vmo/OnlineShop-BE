import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartProduct } from './cart_product.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the cart',
    example: 1,
  })
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  @Exclude()
  @IsNotEmpty()
  @ApiHideProperty()
  user: User;

  @IsNotEmpty()
  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
    eager: true,
  })
  @ApiProperty({
    type: () => [CartProduct],
    description: 'Array of cart products',
  })
  @JoinColumn()
  items: CartProduct[];

  @Column('float')
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Total price',
  })
  total: number;

  @Column('float')
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Price before discount',
  })
  subtotal: number;
}
