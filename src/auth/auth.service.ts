/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, ConflictException, Injectable } from '@nestjs/common';
import { SignUpTdo } from './tdos/signUpTdo';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(@InjectModel(Admin.name) private AdminModel : Model<Admin>) {}
    async signup(@Body() signUpData : SignUpTdo) {
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
}   
