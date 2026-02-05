import { GraphQLError } from "graphql";
import prisma from "../prisma";

export class ProductService {
  //Not used
  // static async getById(id: string) {
  //   return prisma.product.findUnique({
  //     where: { id },
  //   });
  // }

  static async getByIdAndClient(id: string, clientId: string) {
    return prisma.product.findFirst({
      where: { id, clientId },
    });
  }

  static async getAllByClient(clientId: string) {
    return prisma.product.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(
    clientId: string,
    data: {
      name: string;
      description?: string;
      stock: number;
      price: number;
      imageUrl?: string;
    },
  ) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        clientId: clientId,
        name: data.name,
      },
    });

    if (existingProduct) {
      throw new GraphQLError("Resource already exists", {
        extensions: {
          code: "ALREADY_EXISTS",
          http: { status: 409 }
        }
      })
    }

    return prisma.product.create({
      data: {
        clientId,
        ...data,
      },
    });
  }

  static async update(
    id: string,
    clientId: string,
    data: {
      name?: string;
      description?: string;
      stock?: number;
      price?: number;
      imageUrl?: string;
      isActive?: boolean;
    },
  ) {
    // verify product belongs to the client
    const product = await this.getByIdAndClient(id, clientId);
    if (!product) {
      throw new GraphQLError("Resource not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 }
        }
      })
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, clientId: string) {
    // verify
    const product = await this.getByIdAndClient(id, clientId);
    if (!product) {
      throw new GraphQLError("Resource not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 }
        }
      })
    }

    return prisma.product.delete({
      where: { id },
    });
  }
}
