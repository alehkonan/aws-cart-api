import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Cart } from '../../cart/models/cart';

const orderStatus = {
  open: 'OPEN',
  approved: 'APPROVED',
  confirmed: 'CONFIRMED',
  sent: 'SENT',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
} as const;

type OrderStatus = (typeof orderStatus)[keyof typeof orderStatus];

export type CreateOrderAttributes = {
  userId: string;
  cartId: string;
  total: number;
  status?: OrderStatus;
  payment?: string;
  delivery?: string;
  comments?: string;
};

@Table({ tableName: 'orders', timestamps: false, underscored: true })
export class Order extends Model<Order, CreateOrderAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId!: string;

  @ForeignKey(() => Cart)
  @Column({ type: DataType.UUID, onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  cartId!: string | null;

  @BelongsTo(() => Cart)
  cart!: Cart;

  @Column({ type: DataType.JSON })
  payment!: string | null;

  @Column({ type: DataType.JSON })
  delivery!: string | null;

  @Column({ type: DataType.TEXT })
  comments!: string | null;

  @Default(orderStatus.open)
  @Column({ type: DataType.ENUM(...Object.values(orderStatus)) })
  status!: OrderStatus;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(10, 2) })
  total!: number;
}
