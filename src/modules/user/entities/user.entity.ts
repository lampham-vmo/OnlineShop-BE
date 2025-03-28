
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;   
  
  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: false})
  isVerified: boolean;

  @Column()
  fullName: string;

  @Column()
  address: string;
}