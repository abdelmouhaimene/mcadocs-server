import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DemandesService } from './demandes.service';
// import { CreateDemandeDto } from './dto/create-demande.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
    const uploadPath = './uploads'; // Define where to store files
    return this.demandesService.uploadDocumentToDisk(nom,matricule, file, uploadPath);
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
