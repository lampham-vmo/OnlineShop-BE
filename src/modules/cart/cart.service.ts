import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/Entity/product.entity';
import { User } from '../user/entities/user.entity';
import { CartProduct } from './entities/cart_product.entity';
import { throwError } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CartProduct) private cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>
  ) { }

  async addProductToCart(userId: number, productId: number, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findOneBy({ id: productId })
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (product === null || cart == null) {
      return false
    } else {
      const temp = this.cartProductRepository.create({
        product: product,
        cart: cart,
        quantity: quantity
      })
      await this.cartProductRepository.save(temp)
      const newTotal = cart.items.reduce((sum, item) => sum + item.product.price, 0)
      const newSubTotal = cart.items.reduce((sum, item) => sum + (item.product.price - item.product.discount), 0)
      await this.cartRepository.update({ user: { id: userId } }, { total: newTotal, subtotal: newSubTotal })
      return true
    }
  }

  async getAllInCart(userId: number): Promise<Cart | null> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!cart) {
      return null
    } else {
      return cart
    }
  }

  async increaseQuantityById(userId: number, productId: number): Promise<boolean> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    }); 
    if (!cart) {
      return false
    } else {
      const temp = await this.cartProductRepository.findOneBy({ id: productId })
      const quantity = temp!.quantity >= temp!.product.stock ? temp!.product.stock : temp!.quantity++
      await this.cartProductRepository.update(productId, { quantity: quantity })
      return true
    }
  }

  async decreaseQuantityById(userId: number, productId: number): Promise<boolean> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    }); 
    if (!cart) {
      return false
    } else {
      const temp = await this.cartProductRepository.findOneBy({ id: productId })
      const quantity = temp!.quantity < 2 ? 1 : temp!.quantity--
      await this.cartProductRepository.update(productId, { quantity: quantity })
      return true
    }
  }

  async deleteCartProductById(productId: number): Promise<boolean> {
    const product = await this.cartProductRepository.find({ where: { id: productId } })
    if (!product) {
      return false
    } else {
      await this.cartProductRepository.delete({ id: productId })
      return true
    }
  }
}