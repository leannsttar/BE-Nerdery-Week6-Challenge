// interfaces/products/product-resolver.interface.ts
import { CreateProductData, UpdateProductData } from './product-service.interface';

export interface GetProductByIdArgs {
  id: string;
}

export interface CreateProductArgs {
  input: CreateProductData;
}

export interface UpdateProductArgs {
  input: UpdateProductData & { id: string };
}