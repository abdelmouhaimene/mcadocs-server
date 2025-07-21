import { IsString,MinLength,Length } from "class-validator"
export class LoginTdo {
    @IsString()
    @Length(6)
    matricule!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}