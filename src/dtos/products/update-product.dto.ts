import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class UpdateProductDTO {
    @IsUUID()
    @IsNotEmpty()
    id!: string

      @IsString()
      @IsOptional()
      name!: string
    
      @IsString()
      @IsOptional()
      description?: string
    
      @IsNumber()
      @IsOptional()
      stock!: number
    
      @IsNumber()
      @IsOptional()
      price!: number
    
      @IsUrl()
      @IsOptional()
      imageUrl?: string
}