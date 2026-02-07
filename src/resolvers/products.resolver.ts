import { ProductService } from "../services/products.service";
import { validateDto } from "../utils/validations";
import { ProductIdDto } from "../dtos/products/product-id.dto";
import { CreateProductDTO } from "../dtos/products/create-product.dto";
import { UpdateProductDTO } from "../dtos/products/update-product.dto";
import { notFound } from "../errors/domain-errors";

import { GraphQLContext } from "../interfaces/context.interface";
import {
  GetProductByIdArgs,
  CreateProductArgs,
  UpdateProductArgs,
} from "../interfaces/products/product-resolver.interface";

import { Product } from "@prisma/client";

import { bucketName, bucketRegion } from "../config/s3.config";

export const productResolvers = {
  Query: {
    async getProductById(
      _: unknown,
      args: GetProductByIdArgs,
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id: args.id });

      const product = await ProductService.getByIdAndClient(args.id, clientId);

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
      args: CreateProductArgs,
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      const validatedData = await validateDto(CreateProductDTO, args.input);

      return ProductService.create(clientId, validatedData);
    },

    async updateProduct(
      _: unknown,
      args: UpdateProductArgs,
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      const validatedData = await validateDto(UpdateProductDTO, args.input);
      const { id, ...updateData } = validatedData;

      return ProductService.update(id, clientId, updateData);
    },

    async deleteProduct(
      _: unknown,
      args: GetProductByIdArgs,
      context: GraphQLContext,
    ): Promise<string> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id: args.id });

      const product = await ProductService.delete(args.id, clientId);
      return product.id;
    },

    async disableProduct(
      _: unknown,
      args: GetProductByIdArgs,
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id: args.id });

      return ProductService.disable(args.id, clientId);
    },

    async enableProduct(
      _: unknown,
      args: GetProductByIdArgs,
      context: GraphQLContext,
    ): Promise<Product> {
      const { clientId } = context.apiKey;
      await validateDto(ProductIdDto, { id: args.id });

      return ProductService.enable(args.id, clientId);
    },
  },

  Product: {
    imageUrl: (parent: any) => {
      const key = parent.imageUrl;

      if (!key) return null;
      if (key.startsWith("http")) return key;

      return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${key}`;
    },
  },
};
