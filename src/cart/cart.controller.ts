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
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { RefillCartDto } from './dto/refill-cart.dto';

@Controller('api/profile/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();
    const cart = await this.cartService.findOrCreateCart(userId);

    return cart.items ?? [];
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async refillCart(@Req() req: AppRequest, @Body() body: RefillCartDto) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();

    const openCart = await this.cartService.findOpenCart(userId);
    if (!openCart) {
      throw new BadRequestException('There is no open cart for this user');
    }

    await this.cartService.addCartItem({
      cartId: openCart.id,
      productId: body.product.id,
      count: body.count,
    });

    const updatedCart = await openCart.reload();

    return updatedCart.items ?? [];
  }

  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  removeUserCart(@Req() req: AppRequest) {
    const userId = getUserIdFromRequest(req);
    if (!userId) throw new UnauthorizedException();
    this.cartService.removeCart(userId);
  }
}
