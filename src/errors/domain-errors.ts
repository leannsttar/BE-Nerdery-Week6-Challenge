export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "INTERNAL_SERVER_ERROR",
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (resource: string = "Resource") => 
  new AppError(`${resource} not found`, "NOT_FOUND", 404);

export const alreadyExists = (resource: string = "Resource") => 
  new AppError(`${resource} already exists`, "ALREADY_EXISTS", 409);

export const badRequest = (message: string) => 
  new AppError(message, "BAD_REQUEST", 400);