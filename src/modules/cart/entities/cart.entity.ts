import { User } from "src/modules/user/entities/user.entity";
import { CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartProduct } from "./cart_product.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        type: Number,
        description: 'Unique identifier for the cart',
        example: 1,
    })
    id: number;

    @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
    @ApiProperty({
        type: User,
        description: 'User associated with the cart',
    })
    user: User;

    @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
        eager: true,
        cascade: true,
    })
    @ApiProperty({
        type: [CartProduct],
        description: 'Array of cart products',
    })
    items: CartProduct[]; // Array of cart products

    @CreateDateColumn()
    @ApiProperty({
        type: Date,
        description: 'Date when the cart was created',
    })
    createdAt: Date; // Date when the cart was created

    @UpdateDateColumn()
    @ApiProperty({
        type: Date,
        description: 'Date when the cart was last updated',
    })
    updatedAt: Date;

}