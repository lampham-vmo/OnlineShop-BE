import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/modules/product/Entity/product.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Exclude } from "class-transformer";


@Entity()
export class CartProduct{
    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Unique identifier for the product in cart',
        example: 1,
    })
    id: number;

    @IsNotEmpty()
    @ManyToOne(() => Product, (product) => product.cartProducts)
    @ApiProperty({
        type:() => Product,
        description: 'Product associated with the cart product item',
    })
    product: Product;

    @IsNotEmpty()
    @ManyToOne(() => Cart, (cart) => cart.items)
    @ApiProperty({
        type: () => Cart,
        description: 'Cart associated with the cart product item',
    })
    @Exclude()
    cart: Cart;

    @IsNotEmpty()
    @Column({default: 1})
    @ApiProperty({
        type: Number,
        description: 'Quantity of the product in the cart',
        example: 2,
    })
    quantity: number;
}