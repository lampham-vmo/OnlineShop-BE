import { Transform } from "class-transformer";
import { Category } from "src/modules/category/entities/category.entity";
import { Entity,Column, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

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

    @Column()
    image: string

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({
        name: "category_id",
        referencedColumnName: "id"
    })
    category: Category
}