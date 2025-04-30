import { Role } from 'src/modules/role/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @ApiProperty({
    type: 'integer',
    example: 1,
    description: 'Unique user ID',
  })
  id: number;

  @Column({ unique: true, length: 255 })
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'user@example.com',
    description: 'User email address',
    minLength: 5,
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @ApiProperty({
    type: 'string',
    example: 'StrongP@ssw0rd!',
    description:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    minLength: 8,
    maxLength: 20,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  @ApiProperty({
    type: () => Role,
    description: 'The role object of the user',
  })
  role: Role;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({ default: 2 })
  @ApiProperty({
    type: 'integer',
    example: 2,
    description: 'Role ID of the user (defaults to 2)',
  })
  @IsNumber()
  @Expose()
  role_id: number;

  @Column({ nullable: true, length: 11 })
  @ApiProperty({
    type: 'string',
    example: '0987654321',
    description: 'Phone number (digits only)',
    minLength: 10,
    maxLength: 11,
    pattern: '^\\d{10,11}$',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(11)
  @Matches(/^\d+$/, { message: 'Phone number must be number only' })
  phone: string;

  @Column({ default: false })
  @ApiProperty({
    type: 'boolean',
    example: false,
    description: 'Whether the user is verified or not',
  })
  isVerified: boolean;

  @Column({ default: 'empty' })
  @ApiProperty({
    type: 'string',
    example: 'empty',
    description: 'Refresh token string',
  })
  refreshToken: string;

  @Column({ length: 255 })
  @ApiProperty({
    type: 'string',
    example: 'Nguyen Van A',
    minLength: 1,
    maxLength: 20,
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  fullname: string;

  @Column({ length: 255 })
  @ApiProperty({
    type: 'string',
    example: '123 Le Duan, Hanoi',
    minLength: 1,
    maxLength: 20,
    description: 'User address',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  address: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @ApiHideProperty()
  @IsNotEmpty()
  @JoinColumn()
  cart: Cart;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Account status (true = active)',
  })
  status: boolean;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    type: 'boolean',
    example: false,
    description: 'Account delete status (false = active)',
  })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2025-04-11T10:00:00Z',
    description: 'Timestamp when account was created',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    example: '2025-04-11T12:00:00Z',
    description: 'Timestamp when account was last updated',
  })
  updatedAt: Date;
}
