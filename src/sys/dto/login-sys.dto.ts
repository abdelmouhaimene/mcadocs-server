import { IsString,MinLength,Length } from "class-validator"
export class LoginSysDto {
    @IsString()
    @Length(6)
    matricule!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}