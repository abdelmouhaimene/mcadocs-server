import { IsBoolean, IsNumber, IsString } from "class-validator"
export class CreateDocDto {
    @IsString()
    nom!: string;
    
    @IsString()
    matricule!: string;

    @IsBoolean()
    consulte !: boolean;

    @IsString()
    filePath !: string;
  
    @IsNumber()
    size !: number;
}
