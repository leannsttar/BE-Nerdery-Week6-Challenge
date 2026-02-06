import { ProductService } from "../services/products.service";
import { validateDto } from "../utils/validations";
import { ProductIdDto } from "../dtos/products/product-id.dto";
import { CreateProductDTO } from "../dtos/products/create-product.dto";
import { UpdateProductDTO } from "../dtos/products/update-product.dto";
import { GraphQLError } from "graphql";

import { GraphQLContext } from "../interfaces/context.interface";
import { GetProductByIdArgs, CreateProductArgs, UpdateProductArgs } from "../interfaces/product-args.interface";

import { Product } from "@prisma/client";

export const productResolvers = {
  Query: {
    async getProductById(_: unknown, args: GetProductByIdArgs, context: GraphQLContext): Promise<Product> {
      const { clientId } = context.apiKey;

      await validateDto(ProductIdDto, { id: args.id } )

      const product = await ProductService.getByIdAndClient(
        args.id,
        clientId,
      );

      if (!product) {
        throw new GraphQLError("Resource not found", {
          extensions: {
            code: "NOT_FOUND",
            http: { status: 404 }
          }
      })
      }

      return product;
    },

    async getAllProducts(_: unknown, __: unknown, context: GraphQLContext): Promise<Product[]> {

      const { clientId } = context.apiKey;

      return ProductService.getAllByClient(clientId);
    },
  },
  Mutation: {
    async createProduct(_: unknown, args: CreateProductArgs, context: GraphQLContext):Promise<Product> {
      const { clientId } = context.apiKey;

      const validatedData = await validateDto(CreateProductDTO, args.input)

      const product = await ProductService.create(clientId, {
        name: validatedData.name,
        description: validatedData.description,
        stock: validatedData.stock,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl
      })

      return product

    },
      async updateProduct(_: unknown, args: UpdateProductArgs, context: GraphQLContext):  Promise<Product> {
        const { clientId } = context.apiKey;

        const validatedData = await validateDto(UpdateProductDTO, args.input)

        const updatedProduct = await ProductService.update(validatedData.id, clientId, {
          name: validatedData.name,
          description: validatedData.description,
          stock: validatedData.stock,
          price: validatedData.price,
          imageUrl: validatedData.imageUrl
        })

        return updatedProduct
      },

    async deleteProduct(_: unknown, args: GetProductByIdArgs, context: GraphQLContext): Promise<string> {
      const { clientId } = context.apiKey;

      await validateDto(ProductIdDto, { id: args.id } )

      const product = await ProductService.delete(
        args.id,
        clientId,
      );

      return product.id;
    },
    async disableProduct(_: unknown, args: GetProductByIdArgs, context: GraphQLContext): Promise<Product> {
      const { clientId } = context.apiKey;

      await validateDto(ProductIdDto, { id: args.id })

      const product = await ProductService.update(
        args.id, 
        clientId, 
        {isActive: false}
      );

      return product
    },
    async enableProduct(_: unknown, args: GetProductByIdArgs, context: GraphQLContext): Promise<Product> {
      const { clientId } = context.apiKey;

      await validateDto(ProductIdDto, { id: args.id })

      const product = await ProductService.update(
        args.id, 
        clientId, 
        {isActive: true}
      );

      return product
    }
  }
};
