import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateOrderAttributes, Order } from '../models/order';
import { CartService } from '../../cart';
import { cartStatus } from '../../cart/models/cart';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderRepository: typeof Order,
    private cartService: CartService,
    private sequelize: Sequelize,
  ) {}

  async getAll() {
    const orders = await this.orderRepository.findAll();
    return orders;
  }

  async checkout(userId: string, orderDto: CreateOrderDto) {
    const openCart = await this.cartService.findOpenCart(userId);
    if (!openCart || !openCart.items?.length) {
      throw new BadRequestException('Cart is empty');
    }
    // TODO calculate total price from dynamodb products table. This is out of the scope for the current task
    const totalPrice = 120;

    const transaction = await this.sequelize.transaction();

    try {
      const order = await this.orderRepository.create(
        {
          userId,
          cartId: openCart.id,
          total: totalPrice,
          delivery: orderDto.address && JSON.stringify(orderDto.address),
          comments: orderDto.address.comment,
          payment: JSON.stringify(orderDto.items),
        },
        { transaction },
      );

      await this.cartService.updateCartStatus(
        openCart.id,
        cartStatus.ordered,
        transaction,
      );

      await transaction.commit();

      return order;
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException('Checkout transaction error');
    }
  }

  private async findById(orderId: string) {
    const order = await this.orderRepository.findByPk(orderId);
    return order;
  }

  async update(orderId: string, orderAttributes: CreateOrderAttributes) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new BadRequestException(`Order id ${orderId} does not exist`);
    }

    const updatedOrder = await order.update(orderAttributes);

    return updatedOrder;
  }
}
