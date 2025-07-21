import { IsString,MinLength,Length,IsIn } from "class-validator"
import { Match } from "./passowrdValidator";
export class SignUpTdo {
    @IsString()
    @Length(6)
    matricule!: string;

    @IsString()
    nom!: string;

    @IsString()
    prenom!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @Match('password', { message: 'Passwords do not match' })
    repassword!: string;

    @IsIn(['doc', 'dir','sys'])
    role!: 'doc' | 'dir' | 'sys';
}