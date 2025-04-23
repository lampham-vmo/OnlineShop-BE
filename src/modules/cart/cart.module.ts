import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart_product.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/Entity/product.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartProduct, Product, User])],
    controllers: [CartController],
    providers: [CartService]
})
export class CartModule {}