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

@Entity('User') // Đảm bảo tên bảng khớp với PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ default: 2 }) // 🟢 role_id default: 2 (user)
  role_id: number;

  @Column({ nullable: true, length: 11 })
  phone: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 'empty' })
  refreshToken: string;

  @Column({ length: 255 })
  fullname: string;

  @Column({ length: 255 })
  address: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
