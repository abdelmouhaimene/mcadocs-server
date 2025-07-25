import { IsString } from "class-validator"
export class DirecteurDto {
    @IsString()
    matricule!: string;
    @IsString()
    direction!: string;
}