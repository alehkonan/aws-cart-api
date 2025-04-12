import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { UsersModule } from './users/users.module';
import { Cart } from './cart/models/cart';
import { CartItem } from './cart/models/cartItem';
import { Order } from './order/models/order';
import { User } from './users/models/user';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    UsersModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      models: [Cart, CartItem, Order, User],
      autoLoadModels: true,
      sync: { alter: true },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
