import {
  GraphQLResolveInfo,
  GraphQLFieldResolver,
  GraphQLError,
} from "graphql";
import { GraphQLContext } from "../interfaces/context.interface";
import { AppError } from "../errors/domain-errors";
import { Prisma } from "@prisma/client";

export const errorMiddleware = async (
  resolve: GraphQLFieldResolver<unknown, GraphQLContext>,
  root: unknown,
  args: unknown,
  context: GraphQLContext,
  info: GraphQLResolveInfo,
) => {
  try {
    return await resolve(root, args, context, info);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const modelName = (error.meta?.modelName as string) || "Record";
      if (error.code === "P2002") {
        throw new AppError(
          `${modelName} already exists`,
          "ALREADY_EXISTS",
          409,
        );
      }
      if (error.code === "P2025") {
        throw new AppError(`${modelName} not found`, "NOT_FOUND", 404);
      }
    }

    if (error instanceof AppError || error instanceof GraphQLError) {
      throw error;
    }
    throw new AppError("Internal Server Error", "INTERNAL_SERVER_ERROR", 500);
  }
};
