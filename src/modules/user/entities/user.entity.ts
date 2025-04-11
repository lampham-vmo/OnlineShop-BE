import { Role } from 'src/modules/role/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
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
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


@Entity('User') // Đảm bảo tên bảng khớp với PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @ApiProperty()
  id: number;

  @Column({ unique: true, length: 255 })
  @ApiProperty({format: "email"})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: 'password match pattern and length',
    minLength: 8,
    maxLength: 20,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ default: 2 }) // 🟢 role_id default: 2 (user)
  @ApiProperty()
  @IsNumber()
  @Expose()
  role_id: number;

  @Column({ nullable: true, length: 11 })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(11)
  @Matches(/^\d+$/, { message: 'Phone number must be number only' })
  phone: string;

  @Column({ default: false })
  @ApiProperty()
  isVerified: boolean;

  @Column({ default: 'empty' })
  @ApiProperty()
  refreshToken: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty()
  fullname: string;

  @Column({ length: 255 })
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  address: string;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  updatedAt: Date;
}
