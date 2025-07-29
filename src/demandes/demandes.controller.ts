import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, NotFoundException, Res } from '@nestjs/common';
import { DemandesService } from './demandes.service';
// import { CreateDemandeDto } from './dto/create-demande.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}
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
 
   @Get('by-name/:nom') // e.g., GET /demandes/by-name/MyDocument
  async getFileByName(
    @Param('nom') nom: string,
    @Res() res: Response,
  ) {
    try {
      const { fileStream, metadata } = await this.demandesService.getFileByName(nom);

      // Set headers for file download
      res.set({
        'Content-Type': metadata.mimetype,
        'Content-Length': metadata.size,
        'Content-Disposition': `attachment; filename="${metadata.nom}.pdf"`,
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
  // @Post()
  // create(@Body() createDemandeDto: CreateDemandeDto) {
  //   return this.demandesService.create(createDemandeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.demandesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.demandesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDemandeDto: UpdateDemandeDto) {
  //   return this.demandesService.update(+id, updateDemandeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.demandesService.remove(+id);
  // }
}
