import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  stock!: number

  @IsNumber()
  @IsNotEmpty()
  price!: number

  @IsUrl()
  @IsOptional()
  imageUrl?: string
}