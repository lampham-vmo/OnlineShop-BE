import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionDTO } from 'src/modules/permission/dto/permission-dto';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Role name' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: String })
  description?: string | undefined;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({ name: 'role_permission' }) //rename intermediate table
  @ApiProperty({ type: [PermissionDTO] })
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
