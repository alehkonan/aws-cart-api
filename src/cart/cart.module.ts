import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { Cart } from './models/cart';
import { CartItem } from './models/cartItem';

@Module({
  imports: [SequelizeModule.forFeature([Cart, CartItem])],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
