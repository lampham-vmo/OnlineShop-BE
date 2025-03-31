import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Product } from "../../product/Entity/product.entity";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    name: string

    @Column({nullable: true})
    description: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @OneToMany(()=>Product,(product)=>product.category,{cascade: true})
    products: Product[];
}