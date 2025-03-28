import { Column, PrimaryGeneratedColumn, Timestamp } from "typeorm";

export class Category{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    createAt: Timestamp

    @Column()
    updateAt: Timestamp
}