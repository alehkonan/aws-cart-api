import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart, cartStatus, CartStatus } from '../models/cart';
import { CartItem, CreateCartItemAttributes } from '../models/cartItem';
import { Transaction } from 'sequelize';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private cartRepository: typeof Cart,
    @InjectModel(CartItem) private cartItemRepository: typeof CartItem,
  ) {}

  async findOpenCart(userId: string) {
    const openCart = await this.cartRepository.findOne({
      where: { userId, status: cartStatus.open },
      include: { all: true },
    });

    return openCart;
  }

  async findOrCreateCart(userId: string) {
    const openCart = await this.findOpenCart(userId);
    if (openCart) return openCart;
    const newCart = await this.cartRepository.create({ userId });
    return newCart;
  }

  async addCartItem(newCartItem: CreateCartItemAttributes) {
    const cartItem = await this.cartItemRepository.upsert(newCartItem);

    return cartItem;
  }

  async updateCartStatus(
    cartId: string,
    status: CartStatus,
    transaction?: Transaction,
  ) {
    const cart = await this.cartRepository.findByPk(cartId);
    if (!cart) throw new Error('Cart not found');
    const updatedCart = await cart.update({ status }, { transaction });

    return updatedCart;
  }

  async removeCart(cartId: string) {
    await this.cartRepository.destroy({
      where: { id: cartId },
    });
  }
}
