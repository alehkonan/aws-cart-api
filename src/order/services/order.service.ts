import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderAttributes, Order } from '../models/order';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order) private orderRepository: typeof Order) {}

  async getAll() {
    const orders = await this.orderRepository.findAll();
    return orders;
  }

  async findById(orderId: string) {
    const order = await this.orderRepository.findByPk(orderId);
    return order;
  }

  async create(createAttributes: CreateOrderAttributes) {
    const order = await this.orderRepository.create(createAttributes);
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
