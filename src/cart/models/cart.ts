import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CartItem } from './cartItem';
import { Order } from '../../order/models/order';

export const cartStatus = {
  open: 'OPEN',
  ordered: 'ORDERED',
} as const;

export type CartStatus = (typeof cartStatus)[keyof typeof cartStatus];

export type CreateCartAttributes = {
  userId: string;
};

@Table({ tableName: 'carts', underscored: true })
export class Cart extends Model<Cart, CreateCartAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId!: string;

  @Default(cartStatus.open)
  @Column({ type: DataType.ENUM(...Object.values(cartStatus)) })
  status!: CartStatus;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => CartItem)
  items: CartItem[] | undefined;

  @HasOne(() => Order)
  order: Order | undefined;
}
