import { GraphQLError, GraphQLResolveInfo, GraphQLFieldResolver } from "graphql";
import { AppError } from "../errors/domain-errors";
import { GraphQLContext } from "../interfaces/context.interface";

export const errorMiddleware = async (
  resolve: GraphQLFieldResolver<any, GraphQLContext>,
  root: any,
  args: any,
  context: GraphQLContext,
  info: GraphQLResolveInfo,
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
