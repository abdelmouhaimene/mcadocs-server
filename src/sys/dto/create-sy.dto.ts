import { IsString,MinLength,Length } from "class-validator"
import { Match } from "../../auth/tdos/passowrdValidator";
export class CreateSysDto {
    @IsString()
    @Length(6)
    matricule!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @Match('password', { message: 'Passwords do not match' })
    repassword!: string;
}