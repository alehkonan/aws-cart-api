type ProductItem = {
  productId: string;
  count: number;
};

type Address = {
  address: string;
  firstName: string;
  lastName: string;
  comment?: string;
};

export type CreateOrderDto = {
  items: ProductItem[];
  address: Address;
};
