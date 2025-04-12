import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CartItem } from './cartItem';
import { Order } from '../../order/models/order';
import { User } from '../../users/models/user';

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

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, onUpdate: 'CASCADE', onDelete: 'NO ACTION' })
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

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
