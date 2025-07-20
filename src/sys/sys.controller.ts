import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SysService } from './sys.service';
import { CreateSysDto } from './dto/create-sy.dto';
import { LoginSysDto } from './dto/login-sys.dto';
// import { UpdateSyDto } from './dto/update-sy.dto';

@Controller('sys')
export class SysController {
  constructor(private sysService: SysService) {}

  @Post('create')
  create(@Body() createSysDto: CreateSysDto) {
    return this.sysService.create(createSysDto);
  }

  @Post('login')
  login(@Body() loginSysDto: LoginSysDto) {
    return this.sysService.login(loginSysDto);
  }

  @Get()
  findAll() {
    return this.sysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sysService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSyDto: UpdateSyDto) {
  //   return this.sysService.update(+id, updateSyDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sysService.remove(+id);
  }
}
