import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  getOrders() {
    return this.orderService.getAll();
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async checkout(@Req() req: AppRequest, @Body() orderDto: CreateOrderDto) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();

    const order = await this.orderService.checkout(userId, orderDto);

    return { order };
  }
}
