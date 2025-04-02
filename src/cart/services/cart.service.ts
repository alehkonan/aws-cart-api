import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PutCartPayload } from 'src/order/type';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from '../models/cart';
import { cartStatuses } from '../models/cartStatus';
import { CartItem } from '../models';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private cartRepository: typeof Cart,
    @InjectModel(CartItem) private cartItemRepository: typeof CartItem,
  ) {}

  public async findOpenUserCart(userId: string) {
    const openCart = await this.cartRepository.findOne({
      where: {
        user_id: userId,
        status: cartStatuses.open,
      },
      include: {
        all: true,
      },
    });

    return openCart;
  }

  public async findOrCreateUserCart(userId: string) {
    const openCart = await this.findOpenUserCart(userId);
    if (openCart) return openCart;
    const newCart = await this.cartRepository.create({ user_id: userId });
    return newCart;
  }

  public async updateUserCart(userId: string, payload: PutCartPayload) {
    const openCart = await this.findOpenUserCart(userId);
    if (!openCart) {
      throw new HttpException(
        'There is no open cart for the current user',
        HttpStatus.NOT_FOUND,
      );
    }

    const sameProductItem = openCart.items.find(
      ({ product_id }) => product_id === payload.product.id,
    );

    if (sameProductItem) {
      await this.cartItemRepository.update(
        {
          cart_id: openCart.id,
          product_id: payload.product.id,
          count: payload.count,
        },
        {
          where: {
            product_id: payload.product.id,
          },
        },
      );
    } else {
      await this.cartItemRepository.create({
        cart_id: openCart.id,
        product_id: payload.product.id,
        count: payload.count,
      });
    }

    return openCart.reload();
  }

  async removeUserCart(userId: string) {
    await this.cartRepository.destroy({
      where: { user_id: userId },
    });
  }
}
