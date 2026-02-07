import prisma from "../prisma";
import { Prisma } from "@prisma/client";

import { CreateProductData, UpdateProductData } from "../interfaces/products/product-service.interface";
import { notFound, alreadyExists } from "../errors/domain-errors";

export class ProductService {

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

  static async create(clientId: string, data: CreateProductData) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        clientId: clientId,
        name: data.name,
      },
    });

    if (existingProduct) {
      throw alreadyExists("Product");
    }

    return prisma.product.create({
      data: {
        clientId,
        ...data,
      },
    });
  }

  static async update(id: string, clientId: string, data: UpdateProductData) {
    try {
      return await prisma.product.update({
        where: { 
          id,
          clientId,
        },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw notFound("Product");
      }
      throw error;
    }
  }

  static async delete(id: string, clientId: string) {
    try {
      return await prisma.product.delete({
        where: { 
          id,
          clientId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw notFound("Product");
      }
      throw error;
    }
  }

  private static async toggleActive(id: string, clientId: string, isActive: boolean) {
    try {
      return await prisma.product.update({
        where: { 
          id,
          clientId,
        },
        data: { isActive },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw notFound("Product");
      }
      throw error;
    }
  }

  static async disable(id: string, clientId: string) {
    return this.toggleActive(id, clientId, false);
  }

  static async enable(id: string, clientId: string) {
    return this.toggleActive(id, clientId, true);
  }

}