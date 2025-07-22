import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from "../guards/auth.guard";
import { Roles } from '../guards/roles.decorator';

@UseGuards(AuthGuard)
@Roles('sys')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('create')
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  
  @Get('all/:role')
  async findAllRole(@Param('role') role: 'sys' | 'dir' | 'doc' ) {
    return this.adminsService.findAll(role);
  }

  @Get('all')
  async findAll() {
    return this.adminsService.findAll();
  }

  @Get(':matricule')
  async findOne(@Param('matricule') matricule: string) {
    return this.adminsService.findOne(matricule);
  }

  @Patch(':matricule')
  async update(@Param('matricule') matricule: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(matricule, updateAdminDto);
  }

  @Delete(':matricule')
  async remove(@Param('matricule') matricule: string) {
    return this.adminsService.remove(matricule);
  }
}
