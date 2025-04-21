import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    ) {}

    async createCart(user: User): Promise<Cart> {
        if (!user) {
            throw new NotFoundException('User not found!');
        }
        if(user.cart){
            throw new BadRequestException('User already have cart!');
        } 
        // Create a new cart for the user 
        const cart = this.cartRepository.create({
            user,
            items: []
        });
        return this.cartRepository.save(cart);
  

    }

}

