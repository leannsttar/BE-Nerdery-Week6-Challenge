import { GraphQLError } from "graphql";

export class AppError extends GraphQLError {
  constructor(
    message: string,
    public code: string = "INTERNAL_SERVER_ERROR",
    public statusCode: number = 500,
  ) {
    super(message, {
      extensions: {
        code,
        http: { status: statusCode },
      },
    });
    this.name = "AppError";
  }
}

export class AppErrorFactory {
  constructor(private resource: string = "Resource") {}

  notFound() {
    return new AppError(`${this.resource} not found`, "NOT_FOUND", 404);
  }

  alreadyExists() {
    return new AppError(
      `${this.resource} already exists`,
      "ALREADY_EXISTS",
      409,
    );
  }

  unauthorized() {
    return new AppError(`${this.resource} unauthorized`, "UNAUTHORIZED", 401);
  }

  badRequest(message?: string) {
    return new AppError(
      message ?? `${this.resource} bad request`,
      "BAD_REQUEST",
      400,
    );
  }
}
