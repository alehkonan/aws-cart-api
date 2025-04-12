import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderService } from './services';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { Order } from './models/order';

@Module({
  imports: [CartModule, SequelizeModule.forFeature([Order])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
