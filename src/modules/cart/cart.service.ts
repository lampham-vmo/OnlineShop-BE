import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/Entity/product.entity';
import { User } from '../user/entities/user.entity';
import { CartProduct } from './entities/cart_product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) {}

  async addProductToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<boolean> {
    console.log(userId)
    try {
      
      const product = await this.productRepository.findOneBy({ id: productId });
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ["items","items.product"],
      });
      if (product === null || cart == null) {
        return false;
      } else {
        const temp = this.cartProductRepository.create({
          product: product,
          cart: cart,
          quantity: quantity,
        });
        await this.cartProductRepository.save(temp);
        const updatedCart = await this.cartRepository.findOne({
          where: { id: cart.id },
          relations: ["items", "items.product"],
        });
        if(!updatedCart){
          throw new BadRequestException("Cart Not Found")
        }
        const newTotal = updatedCart.items.reduce(
          (sum, item) => sum + item.product.price,
          0,
        );
        const newSubTotal = updatedCart.items.reduce(
          (sum, item) => sum + (item.product.price - item.product.discount),
          0,
        );
        console.log(newTotal,newSubTotal)
        await this.cartRepository.update(
          { id: cart.id },
          { total: newTotal, subtotal: newSubTotal },
        );
        return true;
      }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async getAllInCart(userId: number): Promise<Cart | null> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!cart) {
      return null;
    } else {
      return cart;
    }
  }

  async increaseQuantityById(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!cart) {
      return false;
    } else {
      const temp = await this.cartProductRepository.findOneBy({
        id: productId,
      });
      const quantity =
        temp!.quantity >= temp!.product.stock
          ? temp!.product.stock
          : temp!.quantity++;
      await this.cartProductRepository.update(productId, {
        quantity: quantity,
      });
      return true;
    }
  }

  async decreaseQuantityById(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!cart) {
      return false;
    } else {
      const temp = await this.cartProductRepository.findOneBy({
        id: productId,
      });
      const quantity = temp!.quantity < 2 ? 1 : temp!.quantity--;
      await this.cartProductRepository.update(productId, {
        quantity: quantity,
      });
      return true;
    }
  }

  async deleteCartProductById(productId: number): Promise<boolean> {
    const product = await this.cartProductRepository.find({
      where: { id: productId },
    });
    if (!product) {
      return false;
    } else {
      await this.cartProductRepository.delete({ id: productId });
      return true;
    }
  }
}
