import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart_product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartProduct])]

})
export class CartModule {
}
