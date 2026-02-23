import "reflect-metadata";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
  IsOptional,
} from "class-validator";
import { plainToInstance } from "class-transformer";
import dotenv from "dotenv";

dotenv.config();

class EnvironmentVariables {
  @IsNumber()
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  BUCKET_NAME!: string;

  @IsString()
  @IsNotEmpty()
  BUCKET_REGION!: string;

  @IsString()
  @IsNotEmpty()
  ACCESS_KEY!: string;

  @IsString()
  @IsNotEmpty()
  SECRET_ACCESS_KEY!: string;
}

export const envConfig = plainToInstance(EnvironmentVariables, process.env, {
  enableImplicitConversion: true,
});

const errors = validateSync(envConfig, { skipMissingProperties: false });

if (errors.length > 0) {
  const missingVars = errors.map((err) => err.property).join(", ");
  throw new Error(
    `ERROR: Missing or invalid configuration in .env: ${missingVars}`,
  );
}
