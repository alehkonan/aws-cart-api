import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Cart } from './cart';

export type CreateCartItemAttributes = {
  cartId: string;
  productId: string;
  count: number;
};

@Table({
  tableName: 'cart_items',
  timestamps: false,
  underscored: true,
})
export class CartItem extends Model<CartItem, CreateCartItemAttributes> {
  @ForeignKey(() => Cart)
  @PrimaryKey
  @Column({ type: DataType.UUID, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  cartId!: string;

  @BelongsTo(() => Cart)
  cart!: Cart;

  @PrimaryKey
  @Column({ type: DataType.UUID })
  productId!: string;

  @Column({ type: DataType.INTEGER })
  count!: number;
}
