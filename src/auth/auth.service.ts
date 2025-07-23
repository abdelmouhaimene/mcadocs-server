 
 
 
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../admins/schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { LoginTdo } from './tdos/LoginDto';
import { JwtService } from '@nestjs/jwt'; 
import { RefreshToken } from './schema/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name) private AdminModel : Model<Admin>,
        @InjectModel(RefreshToken.name) private RefreshTokenModel : Model<RefreshToken>,
        private jwtService : JwtService
    ) {}

    async login(loginTdo : LoginTdo) {
        const {matricule, password} = loginTdo
        const admin = await this.AdminModel.findOne({matricule : matricule})
        if(!admin) throw new UnauthorizedException('login error, invalid matricule or password')
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if(!isPasswordValid) throw new UnauthorizedException('login error, invalid matricule or password')
        return this.generateAdminTokens(admin)
    }

    async refreshTokens(refreshToken: string) {
        const existingToken = await this.RefreshTokenModel.findOne({token: refreshToken})
        if(!existingToken) throw new UnauthorizedException('invalid refresh token')
        if(existingToken.expDate < new Date()) throw new UnauthorizedException('refresh token expired')
        const matricule = existingToken.matricule
        const admin = await this.AdminModel.findOne({matricule})
        if(!admin) throw new UnauthorizedException('user not found')

        return this.generateAdminTokens(admin)
    }

    async generateAdminTokens(admin : Admin) {
        const {matricule, role, nom, prenom} = admin
        const payload = {matricule,role}
        const accessToken = this.jwtService.sign(payload,{})
        const refreshToken = uuidv4()
        await this.storeRefreshToken(matricule, role, refreshToken)
        return {
            nom,
            prenom,
            matricule,
            role,
            accessToken,
            refreshToken
        }
    }

    async storeRefreshToken(matricule: string,role : string , refreshToken: string) {
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
            role,
            token: refreshToken,
            expDate, 
        })
        return newRefreshToken.save()
        // const existingToken = await this.RefreshTokenModel.findOne({userId})
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
        // if(existingToken) {
        //     existingToken.token = hashedRefreshToken
        //     return existingToken.save()
        // }
        // const newRefreshToken = new this.RefreshTokenModel({
        //     userId,
        //     token: hashedRefreshToken
        // })
        // return newRefreshToken.save()
    }

    async logout(matricule: string) {
        const result = await this.RefreshTokenModel.deleteOne({matricule})
        if(result.deletedCount === 0) {
            throw new UnauthorizedException('logout error, no refresh token found for this user')
        }
        return {message: 'logout successful'}
    }
}   
