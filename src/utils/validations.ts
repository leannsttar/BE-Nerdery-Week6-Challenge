import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GraphQLError } from 'graphql';

export async function validateDto<T>(cls: new () => T, plain: any) {
  const instance = plainToInstance(cls, plain);
  const errors = await validate(instance as any);

  if (errors.length > 0) {
    const formattedErrors = formatErrors(errors)

    throw new GraphQLError('Invalid input data', {
      extensions: {
        code: 'BAD_USER_INPUT', 
        http: { status: 400 },
        validationErrors: formattedErrors
      }
    })
  }
  
  return instance as T
}

function formatErrors(errors: ValidationError[]) {
  return errors.reduce((acc, err) => {
    const messages = err.constraints ? Object.values(err.constraints) : ['Invalid value']

    acc[err.property] = messages
    return acc
  }, {} as Record<string, string[]>)
}