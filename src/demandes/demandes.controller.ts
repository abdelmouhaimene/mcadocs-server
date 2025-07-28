import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';

@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}

  @Post()
  create(@Body() createDemandeDto: CreateDemandeDto) {
    return this.demandesService.create(createDemandeDto);
  }

  @Get()
  findAll() {
    return this.demandesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demandesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemandeDto: UpdateDemandeDto) {
    return this.demandesService.update(+id, updateDemandeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demandesService.remove(+id);
  }
}
