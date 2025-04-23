import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartProduct } from "./cart_product.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from 'class-validator';


@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Unique identifier for the cart',
        example: 1,
    })
    id: number;
    
    @OneToOne(() => User, (user) => user.cart)
    @IsNotEmpty()
    @ApiProperty({
        type: User,
        description: 'User associated with the cart',
    })
    user: User;

    @IsNotEmpty()
    @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
        eager: true,
    })
    @ApiProperty({
        type: [CartProduct],
        description: 'Array of cart products',
    })
    items: CartProduct[];

    @Column()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: "Total price"
    })
    total: number;

    @Column()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: "Price before discount"
    })
    subtotal: number
}