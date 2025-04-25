import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Order } from 'src/modules/orders/entities/order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum EStatusPaymentMethod {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class PaymentMethod {
  @Expose()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(0, 50, { message: 'Name must be less than 50 characters' })
  @IsNotEmpty()
  @Column()
  name: string;

  @Expose()
  @ApiProperty({
    enum: EStatusPaymentMethod,
    default: EStatusPaymentMethod.ACTIVE,
  })
  @IsEnum(EStatusPaymentMethod)
  @Column({ type: 'varchar', default: EStatusPaymentMethod.ACTIVE })
  status: EStatusPaymentMethod;

  @Expose()
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // TODO: Relations 1-n between PaymentMethod and Order
  @OneToMany(() => Order, (order) => order.payment)
  orders: Order[];
}
