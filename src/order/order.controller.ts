import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart';
import { cartStatus } from 'src/cart/models/cart';

@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private cartService: CartService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  getOrder() {
    return this.orderService.getAll();
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();

    const openCart = await this.cartService.findOpenCart(userId);
    if (!openCart || !openCart.items?.length) {
      throw new BadRequestException('Cart is empty');
    }

    // TODO get total price from dynamodb products table
    const totalPrice = 120;

    const order = await this.orderService.create({
      userId,
      cartId: openCart.id,
      total: totalPrice,
      delivery: body.address && JSON.stringify(body.address),
      comments: body.address.comment,
      payment: JSON.stringify(body.items),
    });

    await this.cartService.updateCartStatus(openCart.id, cartStatus.ordered);

    return { order };
  }
}
