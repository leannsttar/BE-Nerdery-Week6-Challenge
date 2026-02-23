import { ProductService } from "../services/products.service";
import { validateDto } from "../utils/validations";
import { IdDto } from "../dtos/products/id.dto";
import { CreateProductDTO } from "../dtos/products/create-product.dto";
import { UpdateProductDTO } from "../dtos/products/update-product.dto";
import { AppErrorFactory } from "../errors/domain-errors";

const productError = new AppErrorFactory("Product");

import { GraphQLContext } from "../interfaces/context.interface";
import {
  CreateProductData,
  UpdateProductData,
} from "../interfaces/products/product.interface";

import { Product } from "@prisma/client";

import { StorageService } from "../services/storage.service";

export const productResolvers = {
  Query: {
    async getProductById(
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(IdDto, { id });

      const product = await ProductService.getByIdAndClient(id, clientId);

      if (!product) {
        throw productError.notFound();
      }

      return product;
    },

    async getAllProducts(
      _: unknown,
      __: unknown,
      context: GraphQLContext,
    ): Promise<Product[]> {
      const { clientId } = context.apiKey;
      return ProductService.getAllByClient(clientId);
    },
  },

  Mutation: {
    async createProduct(
      _: unknown,
      { input }: { input: CreateProductData },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      const validatedData = await validateDto(CreateProductDTO, input);

      return ProductService.create(clientId, validatedData);
    },

    async updateProduct(
      _: unknown,
      { input }: { input: UpdateProductData },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      const validatedData = await validateDto(UpdateProductDTO, input);
      const { id, ...updateData } = validatedData;

      return ProductService.update(id, clientId, updateData);
    },

    async deleteProduct(
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(IdDto, { id });

      return ProductService.delete(id, clientId);
    },

    async disableProduct(
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(IdDto, { id });

      return ProductService.disable(id, clientId);
    },

    async enableProduct(
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(IdDto, { id });

      return ProductService.enable(id, clientId);
    },
  },

  Product: {
    imageUrl: (parent: any) => {
      return StorageService.getPublicUrl(parent.imageUrl);
    },
  },
};
