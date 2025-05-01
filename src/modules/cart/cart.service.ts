import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartProduct } from './entities/cart_product.entity';
import { Product } from '../product/Entity/product.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) { }

  private calculateCartTotals(items: CartProduct[]) {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const subtotal = items.reduce(
      (sum, item) =>
        sum +
        item.product.price * (1 - item.product.discount / 100) * item.quantity,
      0,
    );
    return { total, subtotal };
  }

  async addProductToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<boolean> {
    try {
      const product = await this.productRepository.findOneBy({ id: productId });
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
      if (!product || !cart) {
        return false;
      }

      const existingItem = cart.items.find(
        (item) => item.product.id === productId,
      );

      if (existingItem) {
        existingItem.quantity == existingItem.product.stock ? existingItem.quantity = existingItem.product.stock : existingItem.quantity += quantity;
        await this.cartProductRepository.save(existingItem);
      } else {
        const newCartItem = this.cartProductRepository.create({
          product,
          cart,
          quantity,
        });
        await this.cartProductRepository.save(newCartItem);
      }

      const updatedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      });

      if (!updatedCart) {
        throw new BadRequestException('Cart Not Found');
      }

      const { total, subtotal } = this.calculateCartTotals(updatedCart.items);

      await this.cartRepository.update(cart.id, { total, subtotal });

      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async getAllInCart(userId: number): Promise<Cart | null> {
    try {
      const cart = await this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
      return cart;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async increaseQuantityById(
    userId: number,
    cartProductId: number,
  ): Promise<boolean> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        id: cartProductId,
        cart: { user: { id: userId } },
      },
      relations: [
        'cart',
        'cart.user',
        'cart.items',
        'cart.items.product',
        'product',
      ],
    });

    if (!cartProduct) return false;

    const currentQty = cartProduct.quantity;
    const maxQty = cartProduct.product.stock;
    const newQty = currentQty >= maxQty ? maxQty : currentQty + 1;

    await this.cartProductRepository.update(cartProductId, {
      quantity: newQty,
    });

    const { total, subtotal } = this.calculateCartTotals(
      cartProduct.cart.items.map((item) => ({
        ...item,
        quantity: item.id === cartProductId ? newQty : item.quantity,
      })),
    );

    await this.cartRepository.update(cartProduct.cart.id, { total, subtotal });

    return true;
  }

  async decreaseQuantityById(
    userId: number,
    cartProductId: number,
  ): Promise<boolean> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        id: cartProductId,
        cart: { user: { id: userId } },
      },
      relations: [
        'cart',
        'cart.user',
        'cart.items',
        'cart.items.product',
        'product',
      ],
    });

    if (!cartProduct) return false;

    const currentQty = cartProduct.quantity;
    const minQty = 1;
    const newQty = currentQty <= minQty ? minQty : currentQty - 1;

    await this.cartProductRepository.update(cartProductId, {
      quantity: newQty,
    });

    const { total, subtotal } = this.calculateCartTotals(
      cartProduct.cart.items.map((item) => ({
        ...item,
        quantity: item.id === cartProductId ? newQty : item.quantity,
      })),
    );

    await this.cartRepository.update(cartProduct.cart.id, { total, subtotal });

    return true;
  }

  async deleteCartProductById(productId: number): Promise<boolean> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: { id: productId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });

    if (!cartProduct) return false;

    const cartId = cartProduct.cart.id;

    await this.cartProductRepository.delete({ id: productId });

    const remainingItems = cartProduct.cart.items.filter(
      (item) => item.id !== productId,
    );

    const { total, subtotal } = this.calculateCartTotals(remainingItems);

    await this.cartRepository.update(cartId, { total, subtotal });

    return true;
  }

  async clearAllInCart(userId: number): Promise<boolean> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });

    if (!cart) return false;

    if (cart.items.length > 0) {
      await this.cartProductRepository.remove(cart.items);
    }

    await this.cartRepository.update(cart.id, { total: 0, subtotal: 0 });

    return true;
  }
}
