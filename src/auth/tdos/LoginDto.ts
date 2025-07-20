import { IsString,MinLength,Length,IsIn } from "class-validator"
export class LoginTdo {
    @IsString()
    @Length(6)
    matricule!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsIn(['doc', 'dir'])
    role!: 'doc' | 'dir';
}