import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { Roles } from '../guards/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Roles('sys')
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  create(@Body() createDirectionDto: CreateDirectionDto) {
    return this.directionsService.create(createDirectionDto);
  }

  @Get()
  findAll() {
    return this.directionsService.findAll();
  }

  @Get(':nom')
  findOne(@Param('nom') nom: string) {
    return this.directionsService.findOne(nom);
  }

  @Patch(':nom')
  update(@Param('nom') id: string, @Body() nom: string) {
    return this.directionsService.update(nom);
  }

  @Delete(':nom')
  remove(@Param('nom') nom: string) {
    return this.directionsService.remove(nom);
  }
}
