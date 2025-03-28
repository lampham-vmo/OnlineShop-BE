import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity('role') // Đảm bảo tên bảng khớp với PostgreSQL
  export class Role {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true, length: 255 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    @OneToMany(() => User, (user) => user.role)
    users: User[];
  }
  