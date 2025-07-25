import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { Roles } from '../guards/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { DirecteurDto } from './dto/create-directeur.dto';

@UseGuards(AuthGuard)
@Roles('sys')
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  async dcreate(@Body() createDirectionDto: CreateDirectionDto) {
    return await this.directionsService.create(createDirectionDto);
  }

  @Get()
  async findAll() {
    return await this.directionsService.findAll();
  }

  @Get(':nom')
  async findOne(@Param('nom') nom: string) {
    return await this.directionsService.findOne(nom);
  }

  @Patch(':nom')
  async update(@Param('nom') id: string, @Body() nom: string) {
    return await this.directionsService.update(nom);
  }

  @Delete(':nom')
  async remove(@Param('nom') nom: string) {
    return await this.directionsService.remove(nom);
  }

  @Post('directeur')
  async setDirecteur(@Body() directeurDto : DirecteurDto ) {
    return await this.directionsService.setDirecteur(directeurDto)
  }

  @Delete('directeur/:matricule')
  async deleteDirecteur(@Param('matricule') matricule: string ) {
    return await this.directionsService.deleteDirecteur(matricule)
  }

}
