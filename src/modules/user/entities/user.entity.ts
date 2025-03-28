
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;   
  
  @Column()
  password: string;

  @Column({ default: false})
  isVerified: number;

  @Column()
  refreshToken: string;

  @Column()
  fullname: string;

  @Column()
  address: string;

  @Column()
  role_id: number;

  @Column()
  phone: string;

  @Column()
  status: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}