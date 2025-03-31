import { Entity,Column, PrimaryGeneratedColumn, Timestamp, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { Exclude, Transform } from "class-transformer";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string
    
    @Column()
    description: string
    
    @Column({nullable: false})
    stock: number
    
    @Column({type: "float",nullable: false})
    price: number
    
    @Column({nullable: false})
    discount: number
    
    @Column()
    @Exclude()
    rating: number
    
    @Column()
    image: string
    
    @ManyToOne(()=>Category,(category)=>category.products,{onDelete:"CASCADE",nullable: false})
    @JoinColumn({name:"category_id"})
    category: Category

    @CreateDateColumn()
    @Exclude()
    createdAt: Timestamp

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Timestamp

}