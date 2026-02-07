import { GraphQLError } from "graphql";
import { AppError } from "../errors/domain-errors";

export const errorMiddleware = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any,
) => {
  try {
    return await resolve(root, args, context, info);
  } catch (error) {
    if (error instanceof AppError) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
          http: { status: error.statusCode },
        },
      });
    }
    throw error;
  }
};
