type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type RefillCartDto = {
  product: Product;
  count: number;
};
