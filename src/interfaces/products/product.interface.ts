export type CreateProductData = {
  name: string;
  description?: string;
  stock: number;
  price: number;
  imageUrl?: string;
};

export type UpdateProductData = Partial<CreateProductData> & {
  isActive?: boolean;
};