/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpTdo } from './tdos/signUpTdo';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
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

    async signup(signUpData : SignUpTdo) {
        const {matricule, nom, prenom, password, role} = signUpData
        const matriculeInUse = await this.AdminModel.findOne({matricule : matricule})
        if(matriculeInUse) throw new ConflictException('matricule already in use')
        const hashedPassword = await bcrypt.hash(password , 10)
        await this.AdminModel.create({
            matricule,
            nom,
            prenom,
            role,
            password: hashedPassword
        })
    }

    async login(loginTdo : LoginTdo) {
        const {matricule, password} = loginTdo
        const admin = await this.AdminModel.findOne({matricule : matricule})
        if(!admin) throw new UnauthorizedException('login error, invalid matricule or password')
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if(!isPasswordValid) throw new UnauthorizedException('login error, invalid matricule or password')
        return this.generateAdminTokens(admin._id)
    }

    async refreshTokens(refreshToken: string) {
        const existingToken = await this.RefreshTokenModel.findOne({token: refreshToken})
        if(!existingToken) throw new UnauthorizedException('invalid refresh token')
        if(existingToken.expDate < new Date()) throw new UnauthorizedException('refresh token expired')
        const userId = existingToken.userId
        const admin = await this.AdminModel.findById(userId)
        if(!admin) throw new UnauthorizedException('user not found')

        return this.generateAdminTokens(userId.toString())
    }

    async generateAdminTokens(userId) {
        const payload = {userId}
        const accessToken = this.jwtService.sign(payload,{})
        const refreshToken = uuidv4()
        await this.storeRefreshToken(userId, refreshToken)
        return {
            accessToken,
            refreshToken
        }
    }

    async storeRefreshToken(userId: string, refreshToken: string) {
        const existingToken = await this.RefreshTokenModel.findOne({userId})
        const expDate = new Date()
        expDate.setDate(expDate.getDate() + 42) 
        if (existingToken) {
            existingToken.token = refreshToken
            existingToken.expDate = expDate
            return existingToken.save()
        }
        const newRefreshToken = new this.RefreshTokenModel({
            userId, 
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
}   
