import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CartStatus } from './cartStatus';
import { CartItem } from './cartItem';

interface CartCreationAttributes {
  user_id: string;
}

@Table({ tableName: 'carts' })
export class Cart extends Model<Cart, CartCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID })
  user_id!: string;

  @Default('OPEN')
  @Column({ type: DataType.ENUM<CartStatus>('OPEN', 'ORDERED') })
  status!: CartStatus;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;

  @HasMany(() => CartItem)
  items!: CartItem[];
}
