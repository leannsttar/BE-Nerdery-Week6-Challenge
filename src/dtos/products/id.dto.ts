import { IsUUID, IsNotEmpty } from "class-validator";

export class IdDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
