import { gql } from "apollo-server-express";

export const productTypeDefs = gql`
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
    deleteProduct(id: ID!): Product!
    disableProduct(id: ID!): Product!
    enableProduct(id: ID!): Product!
  }
`;
