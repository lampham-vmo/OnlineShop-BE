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
  ) { }

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

      // Tìm xem sản phẩm đã có trong cart chưa
      const existingItem = cart.items.find(
        (item) => item.product.id === productId,
      );

      if (existingItem) {
        // Nếu đã có, tăng quantity
        existingItem.quantity += quantity;
        await this.cartProductRepository.save(existingItem);
      } else {
        // Nếu chưa có, tạo mới
        const newCartItem = this.cartProductRepository.create({
          product: product,
          cart: cart,
          quantity: quantity,
        });
        await this.cartProductRepository.save(newCartItem);
      }

      // Cập nhật lại cart sau khi thay đổi
      const updatedCart = await this.cartRepository.findOne({
        where: { id: cart.id },
        relations: ['items', 'items.product'],
      });

      if (!updatedCart) {
        throw new BadRequestException('Cart Not Found');
      }

      const newTotal = updatedCart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );

      const newSubTotal = updatedCart.items.reduce(
        (sum, item) =>
          sum + (item.product.price - item.product.discount) * item.quantity,
        0,
      );

      await this.cartRepository.update(
        { id: cart.id },
        { total: newTotal, subtotal: newSubTotal },
      );

      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getAllInCart(userId: number): Promise<Cart | null> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      return null;
    }
    return cart;
  }

  async increaseQuantityById(
    userId: number,
    cartProductId: number,
  ): Promise<boolean> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        id: cartProductId,
        cart: {
          user: { id: userId },
        },
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
    const newTotal = cartProduct.cart.items.reduce(
      (sum, item) =>
        sum +
        item.product.price *
        (item.id === cartProductId ? newQty : item.quantity),
      0,
    );
    const newSubTotal = cartProduct.cart.items.reduce(
      (sum, item) =>
        sum +
        (item.product.price - item.product.discount) *
        (item.id === cartProductId ? newQty : item.quantity),
      0,
    );
    await this.cartRepository.update(cartProduct.cart.id, {
      total: newTotal,
      subtotal: newSubTotal,
    });
    return true;
  }

  async decreaseQuantityById(
    userId: number,
    cartProductId: number,
  ): Promise<boolean> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        id: cartProductId,
        cart: {
          user: { id: userId },
        },
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
    const newTotal = cartProduct.cart.items.reduce(
      (sum, item) =>
        sum +
        item.product.price *
        (item.id === cartProductId ? newQty : item.quantity),
      0,
    );
    const newSubTotal = cartProduct.cart.items.reduce(
      (sum, item) =>
        sum +
        (item.product.price - item.product.discount) *
        (item.id === cartProductId ? newQty : item.quantity),
      0,
    );
    await this.cartRepository.update(cartProduct.cart.id, {
      total: newTotal,
      subtotal: newSubTotal,
    });
    return true;
  }

  async deleteCartProductById(productId: number): Promise<boolean> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: { id: productId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!cartProduct) {
      return false;
    }
    const cartId = cartProduct.cart.id;
    await this.cartProductRepository.delete({ id: productId });
    const remainingItems = cartProduct.cart.items.filter(
      (item) => item.id !== productId,
    );
    const newTotal = remainingItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const newSubTotal = remainingItems.reduce(
      (sum, item) =>
        sum + (item.product.price - item.product.discount) * item.quantity,
      0,
    );
    await this.cartRepository.update(cartId, {
      total: newTotal,
      subtotal: newSubTotal,
    });
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