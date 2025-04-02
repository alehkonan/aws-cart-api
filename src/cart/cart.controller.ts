import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { Order, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();
    const cart = await this.cartService.findOrCreateUserCart(userId);

    return cart.items ?? [];
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: PutCartPayload) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();
    const cart = await this.cartService.updateUserCart(userId, body);

    return cart.items;
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  removeUserCart(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();
    this.cartService.removeUserCart(userId);
  }

  @UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();
    const openCart = await this.cartService.findOpenUserCart(userId);

    if (!openCart || !openCart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    // TODO get total price from dynamodb products table
    const totalPrice = 120;

    const order = this.orderService.create({
      userId,
      cartId: openCart.id,
      items: openCart.items.map((item) => ({
        productId: item.product_id,
        count: item.count,
      })),
      address: body.address,
      total: totalPrice,
    });

    await this.cartService.removeUserCart(userId);

    return {
      order,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  getOrder(): Order[] {
    return this.orderService.getAll();
  }
}
