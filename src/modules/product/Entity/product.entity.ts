import { Entity,Column, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    category_id: number

    @Column({nullable: false})
    name: string

    @Column()
    description: string

    @Column({nullable: false})
    stock: number

    @Column({nullable: false})
    price: number

    @Column({nullable: false})
    discount: number

    @Column()
    rating: number

    @Column({type: "bytea",nullable: true})
    image: Buffer

    @Column()
    createdAt: Timestamp

    @Column()
    updatedAt: Timestamp

}