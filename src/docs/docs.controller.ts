import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocsService } from './docs.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post()
  create(@Body() createDocDto: CreateDocDto) {
    return this.docsService.create(createDocDto);
  }

  @Get()
  findAll() {
    return this.docsService.findAll();
  }

  @Get(':nom')
  findOne(@Param('nom') nom: string) {
    return this.docsService.findOne(+nom);
  }

  @Get('direction/:direction')
  findAllByDirection(@Param('direction') direction: string) { 
    return this.docsService.findAllByDirection(direction);
  }
  
  @Get('directeur/:matricule')
  findAllByDirecteur(@Param('matricule') matricule: string) {   
    return this.docsService.findAllByDirecteur(matricule);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDocDto: UpdateDocDto) {
  //   return this.docsService.update(+id, updateDocDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.docsService.remove(+id);
  // }
}
