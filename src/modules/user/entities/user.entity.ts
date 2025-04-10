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
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


@Entity('User') // Đảm bảo tên bảng khớp với PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true, length: 255 })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
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
  @ApiProperty()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ default: 2 }) // 🟢 role_id default: 2 (user)
  @ApiProperty()
  role_id: number;

  @Column({ nullable: true, length: 11 })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(11)
  @Matches(/^\d+$/, { message: 'Phone number must be number only' })
  @ApiProperty()
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
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty()
  address: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
