export interface GetProductByIdArgs {
    id: string
}

export interface CreateProductInput {
    name: string,
    description: string,
    stock: number,
    price: number,
    imageUrl?: string
}

export interface CreateProductArgs {
    input: CreateProductInput
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string
}

export interface UpdateProductArgs {
    input: UpdateProductInput;
}