import { IsString } from "class-validator"
export class CreateDirectionDto {
    @IsString()
    nom!: string;
}