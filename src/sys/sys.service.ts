import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSysDto } from './dto/create-sy.dto';
// import { UpdateSyDto } from './dto/update-sy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sys } from './schemas/sy.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { LoginSysDto } from './dto/login-sys.dto';
import { RefreshTokenSys } from './schemas/refreshTokenSys.schema';
@Injectable()
export class SysService {
  constructor(
          @InjectModel(Sys.name) private SysAdminModel : Model<Sys>,
          @InjectModel(RefreshTokenSys.name) private RefreshTokenModel : Model<RefreshTokenSys>,
          private jwtService : JwtService
      ) {}
  
  async create(createSyDto: CreateSysDto) {
    const {matricule, password} = createSyDto
    const matriculeInUse = await this.SysAdminModel.findOne({matricule : matricule})
    if(matriculeInUse) throw new ConflictException('matricule already in use')
    const hashedPassword = await bcrypt.hash(password , 10)
    await this.SysAdminModel.create({
        matricule,
        password: hashedPassword
    })
  }

  async login(loginSysDto : LoginSysDto){
    const {matricule, password} = loginSysDto
    const sys = await this.SysAdminModel.findOne({matricule : matricule})
    if(!sys) throw new UnauthorizedException('login error, invalid matricule or password')
    const isPasswordValid = await bcrypt.compare(password, sys.password)
    if(!isPasswordValid) throw new UnauthorizedException('login error, invalid matricule or password')
    return this.generateSysTokens(sys.matricule)
  }

  async refreshTokens(refreshToken: string) {
      const existingToken = await this.RefreshTokenModel.findOne({token: refreshToken})
      if(!existingToken) throw new UnauthorizedException('invalid refresh token')
      if(existingToken.expDate < new Date()) throw new UnauthorizedException('refresh token expired')
      const matricule = existingToken.matricule
      const admin = await this.SysAdminModel.findById(matricule)
      if(!admin) throw new UnauthorizedException('user not found')

      return this.generateSysTokens(matricule)
  }

  async generateSysTokens(matricule) {
      const payload = {matricule}
      const accessToken = this.jwtService.sign(payload)
      const refreshToken = uuidv4()
      await this.storeRefreshToken(matricule, refreshToken)
      return {
          accessToken,
          refreshToken
      }
  }

  async storeRefreshToken(matricule: string, refreshToken: string) {
      const existingToken = await this.RefreshTokenModel.findOne({matricule})
      const expDate = new Date()
      expDate.setDate(expDate.getDate() + 42) 
      if (existingToken) {
          existingToken.token = refreshToken
          existingToken.expDate = expDate
          return existingToken.save()
      }
      const newRefreshToken = new this.RefreshTokenModel({
          matricule, 
          token: refreshToken,
          expDate, 
      })
      return newRefreshToken.save()
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
