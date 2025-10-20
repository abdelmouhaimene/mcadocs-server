import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, NotFoundException, Res, UseGuards } from '@nestjs/common';
import { DemandesService } from './demandes.service';
// import { CreateDemandeDto } from './dto/create-demande.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { SelfGuard } from 'src/guards/self.guard';


@UseGuards(AuthGuard)
// @Roles('sys')
// @UseGuards(SelfGuard)
@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}

  @Roles('dir')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form
  async uploadDocument(
    @Body('nom') nom: string, // Get 'name' from the request body
    @Body('matricule') matricule: string,
    @UploadedFile() file: Express.Multer.File, // The uploaded PDF
  ) {
    const uploadPath = './demandes'; // Define where to store files
    return this.demandesService.uploadDocumentToDisk(nom,matricule, file, uploadPath);
  }
 
  @Get('download/:nom') // e.g., GET /demandes/by-name/MyDocument
  async getFileByName(
    @Param('nom') nom: string,
    @Res() res: Response,
  ) {
    try {
      const { fileStream, metadata } = await this.demandesService.downloadFileByName(nom);

      // Set headers for file download
      res.set({
        'Content-Type': metadata.mimetype,
        'Content-Length': metadata.size,
        'Content-Disposition': `inline; filename="${metadata.nom}.pdf"`,
      });

      // Pipe the file stream to the response
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Roles('sys','doc')
  @Get('all')
  async findAll() {
    return this.demandesService.findAll();
  }

  @Roles('sys','doc')
  @Get('all/consulte')
  async findAllByConsulte(@Body('status') status: boolean) {
    return this.demandesService.findAllByConsulte(status);
  }

  @Roles('sys','doc')
  @Get('all/accepte')
  async findAllByAccepte(@Body('status') status: boolean) {
    return this.demandesService.findAllByAccepte(status);
  }

  @Roles('sys','doc')
  @Get('all/matricule/:matricule')
  async findAllByMatricule(@Param('matricule') matricule: string) {
    return this.demandesService.findAllByMatricule(matricule);
  }

  @Roles('dir')
  @Patch('update/:nom')
  @UseInterceptors(FileInterceptor('newFile'))
  async updateDemande(@Param('nom') nom: string,@Body('newNom') newNom: string , @UploadedFile() newFile: Express.Multer.File  ) {
    return this.demandesService.updateOne(nom, newNom, newFile);
  }

  @Roles('doc')
  @Patch('accepte/:nom')
  async setAccepte(@Param('nom') nom: string,@Body('status') status: boolean) {
    return this.demandesService.setAccepte(nom,status);
  }
  
  @Roles('doc')
  @Patch('consulte/:nom')
  async setConsulte(@Param('nom') nom: string) {
    return this.demandesService.setConsulte(nom);
  }

  @Roles('sys','doc')
  @Get('all/direction/:direction')
  async findAllByDirection(@Param('direction') direction: string) { 
    return this.demandesService.findAllByDirection(direction);
  }

  @Roles('dir')
  @UseGuards(SelfGuard)
  @Get('directeur/:matricule')
  async findAllByDirecteur(@Param('matricule') matricule: string) {
    return this.demandesService.findAllByMatricule(matricule);
  }

  @Roles('dir')
  @UseGuards(SelfGuard)
  @Delete('directeur/:matricule')
  async deleteMydemande(@Param('matricule') matricule: string,@Body('nom') nom: string) {
    return this.demandesService.deleteOne(nom);
  }
}
