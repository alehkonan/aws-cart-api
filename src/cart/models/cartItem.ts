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

interface CartItemCreationAttributes {
  cart_id: string;
  product_id: string;
  count: number;
}

@Table({ tableName: 'cart_items', timestamps: false })
export class CartItem extends Model<CartItem, CartItemCreationAttributes> {
  @PrimaryKey
  @ForeignKey(() => Cart)
  @Column({ type: DataType.UUID, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  cart_id!: string;

  @BelongsTo(() => Cart)
  cart!: Cart;

  @Column({ type: DataType.UUID })
  product_id!: string;

  @Column({ type: DataType.INTEGER })
  count!: number;
}
