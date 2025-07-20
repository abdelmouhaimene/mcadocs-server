import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSysDto } from './dto/create-sy.dto';
// import { UpdateSyDto } from './dto/update-sy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sys } from './schemas/sy.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class SysService {
  constructor(
          @InjectModel(Sys.name) private SysAdminModel : Model<Sys>,
          // @InjectModel(RefreshToken.name) private RefreshTokenModel : Model<RefreshToken>,
          private jwtService : JwtService
      ) {}
  
  async create(createSyData: CreateSysDto) {
    const {matricule, password} = createSyData
    const matriculeInUse = await this.SysAdminModel.findOne({matricule : matricule})
    if(matriculeInUse) throw new ConflictException('matricule already in use')
    const hashedPassword = await bcrypt.hash(password , 10)
    await this.SysAdminModel.create({
        matricule,
        password: hashedPassword
    })
  }

  findAll() {
    return `This action returns all sys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sy`;
  }

  // update(id: number, updateSyDto: UpdateSyDto) {
  //   return `This action updates a #${id} sy`;
  // }

  remove(id: number) {
    return `This action removes a #${id} sy`;
  }
}
