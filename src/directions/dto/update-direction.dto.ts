import { IsString } from "class-validator"
export class UpdateDirectionDto {
    @IsString()
    newNom!: string;
}