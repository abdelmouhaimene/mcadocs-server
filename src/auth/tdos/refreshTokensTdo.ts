import { IsString} from "class-validator"
export class RefreshTokenTdo {
    @IsString()
    token!: string;
}