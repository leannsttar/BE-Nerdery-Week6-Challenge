import { ProductService } from "../services/products.service";
import { validateDto } from "../utils/validations";
import { ProductIdDto } from "../dtos/products/product-id.dto";
import { CreateProductDTO } from "../dtos/products/create-product.dto";
import { UpdateProductDTO } from "../dtos/products/update-product.dto";
import { notFound } from "../errors/domain-errors";

import { GraphQLContext } from "../interfaces/context.interface";
import { CreateProductData, UpdateProductData } from "../interfaces/products/product.interface";

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
      await validateDto(ProductIdDto, { id });

      const product = await ProductService.getByIdAndClient(id, clientId);

      if (!product) {
        throw notFound("Product");
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
    ): Promise<string> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id });

      const product = await ProductService.delete(id, clientId);
      return product.id;
    },

    async disableProduct(
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id });

      return ProductService.disable(id, clientId);
    },

    async enableProduct(
      _: unknown,
      { id }: { id: string },
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id });

      return ProductService.enable(id, clientId);
    },
  },

  Product: {
    imageUrl: (parent: any) => {
      return StorageService.getPublicUrl(parent.imageUrl);
    },
  },
};
