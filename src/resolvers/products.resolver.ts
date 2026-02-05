import { gql } from "apollo-server-express";
import { ProductService } from "../services/products.service";
import { validateDto } from "../utils/validations";
import { ProductIdDto } from "../dtos/products/product-id.dto";
import { CreateProductDTO } from "../dtos/products/create-product.dto";
import { UpdateProductDTO } from "../dtos/products/update-product.dto";
import { GraphQLError } from "graphql";

// GraphQL typeDefs
export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    stock: Int!
    price: Float!
    isActive: Boolean!
    imageUrl: String
    clientId: ID!
    createdAt: String
    updatedAt: String
  }

  input CreateProductInput {
    name: String!
    description: String
    stock: Int!
    price: Float!
    imageUrl: String
  }

  input UpdateProductInput {
    id: ID!
    name: String
    description: String
    stock: Int
    price: Float
    imageUrl: String
  }

  type Query {
    getProductById(id: ID!): Product
    getAllProducts: [Product!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): ID!
    disableProduct(id: ID!): Product!
    enableProduct(id: ID!): Product!
  }
`;

// Resolvers
export const resolvers = {
  Query: {
    async getProductById(_: any, args: { id: string }, context: any) {
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

    async getAllProducts(_: any, __: any, context: any) {

      const { clientId } = context.apiKey;

      return ProductService.getAllByClient(clientId);
    },
  },
  Mutation: {
    async createProduct(_: any, args: {input: any}, context: any) {
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
      async updateProduct(_: any, args: {input: any}, context: any) {
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

    async deleteProduct(_: any, args: {id: string}, context: any) {
      const { clientId } = context.apiKey;

      await validateDto(ProductIdDto, { id: args.id } )

      const product = await ProductService.delete(
        args.id,
        clientId,
      );

      return product.id;
    },
    async disableProduct(_: any, args: {id: string}, context: any) {
      const { clientId } = context.apiKey;

      await validateDto(ProductIdDto, { id: args.id })

      const product = await ProductService.update(
        args.id, 
        clientId, 
        {isActive: false}
      );

      return product
    },
    async enableProduct(_: any, args: {id: string}, context: any) {
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
