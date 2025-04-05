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
import { Cart } from '../../cart/models/cart';
import { Order } from '../../order/models/order';

export type CreateUserAttributes = {
  name: string;
  password: string;
  email?: string;
};

@Table({
  tableName: 'users',
  underscored: true,
  defaultScope: { attributes: { exclude: ['password'] } },
})
export class User extends Model<User, CreateUserAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  name!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  password!: string;

  @Column({ type: DataType.TEXT })
  email!: string | null;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => Cart)
  carts: Cart[] | undefined;

  @HasMany(() => Order)
  orders: Order[] | undefined;
}
