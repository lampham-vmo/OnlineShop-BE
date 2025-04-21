import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/modules/product/Entity/product.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class CartProduct {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        type: Number,
        description: 'Unique identifier for the cart product',
        example: 1,
    })
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @ApiProperty({
        type: Cart
    })
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.cartProducts, {eager: true, onDelete: 'CASCADE'})
    @ApiProperty({
        type: Product,
        description: 'Product associated with the cart item',
    })
    product: Product;

    @Column({default: 1})
    @ApiProperty({
        type: Number,
        description: 'Quantity of the product in the cart',
        example: 2,
    })
    quantity: number;

    @CreateDateColumn()
    addedAt: Date;
}