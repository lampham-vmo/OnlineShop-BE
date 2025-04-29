import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetail } from './order.detail.entity';
import { Status } from '../enum/status.enum';
import { PaymentMethod } from 'src/modules/payment-method/entities/payment-method.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column('float')
  @IsNumber()
  @ApiProperty()
  subTotal: number;

  @Column('float')
  @IsNumber()
  @ApiProperty()
  total: number;

  @IsString()
  @ApiProperty()
  @Column({ default: Status.UNPAID })
  status: Status;

  @IsString()
  @ApiProperty()
  @Column()
  receiver: string;

  @Column({ nullable: false, length: 11 })
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
  receiver_phone: string;

  @ManyToOne(
    () => PaymentMethod,
    (p) => {
      p.orders;
    },
  )
  @JoinColumn({ name: 'payment_id' })
  @Expose()
  @ApiProperty({
    type: () => PaymentMethod,
  })
  payment: PaymentMethod;

  @IsString()
  @ApiProperty()
  @Column()
  delivery_address: string;

  @ManyToOne(() => User, (user) => user.orders, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  @Expose()
  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: () => [OrderDetail],
  })
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  order_details: OrderDetail[];

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @ApiProperty({ type: 'string', nullable: true })
  orderPaypalId: string;

  @CreateDateColumn()
  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Creation timestamp',
    example: '2025-04-12T10:00:00Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Last update timestamp',
    example: '2025-04-12T11:00:00Z',
  })
  updatedAt: Date;
}
