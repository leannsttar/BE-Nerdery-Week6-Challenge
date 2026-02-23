import prisma from "../prisma";

import {
  CreateProductData,
  UpdateProductData,
} from "../interfaces/products/product.interface";
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
    return prisma.product.create({
      data: {
        clientId,
        ...data,
      },
    });
  }

  static async update(id: string, clientId: string, data: UpdateProductData) {
    return prisma.product.update({
      where: {
        id,
        clientId,
      },
      data,
    });
  }

  static async delete(id: string, clientId: string) {
    return prisma.product.delete({
      where: {
        id,
        clientId,
      },
    });
  }

  private static async toggleActive(
    id: string,
    clientId: string,
    isActive: boolean,
  ) {
    return prisma.product.update({
      where: {
        id,
        clientId,
      },
      data: { isActive },
    });
  }

  static async disable(id: string, clientId: string) {
    return this.toggleActive(id, clientId, false);
  }

  static async enable(id: string, clientId: string) {
    return this.toggleActive(id, clientId, true);
  }
}
