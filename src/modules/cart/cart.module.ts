import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart_product.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartProduct, User])],
    controllers: [CartController], // Add your controllers here
    providers: [CartService], // Add your providers here
    exports: [CartService]

})
export class CartModule {
}
