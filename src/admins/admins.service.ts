import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {  BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { Role } from 'src/types/tools';
@Injectable()
export class AdminsService {
  constructor(
      @InjectModel(Admin.name) private AdminModel : Model<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const {matricule, nom, prenom, password, role} = createAdminDto
    const matriculeInUse = await this.AdminModel.findOne({matricule : matricule})
    if(matriculeInUse) throw new ConflictException('matricule already in use')
    const hashedPassword = await bcrypt.hash(password , 10)
    return await this.AdminModel.create({
        matricule,
        nom,
        prenom,
        role,
        password: hashedPassword
    })
  }

  async findAll(role?: Role) {
    const validRoles: Role[] = ['sys', 'dir', 'doc'];

    if (role && !validRoles.includes(role)) {
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    const query = role ? { role } : {};
    return this.AdminModel.find(query, {
      password: 0,
      __v: 0,
      _id: 0,
    }).exec();
  }

  async findOne(matricule: string) {
    if (!matricule) throw new BadRequestException('Matricule is required');
    return this.AdminModel.findOne({ matricule }, {
      password: 0,
      __v: 0,
      _id: 0,
    }).exec().then(admin => {
      if (!admin) throw new UnauthorizedException('Admin not found');
      return admin;
    });
  }

  async update(matricule: string, updateAdminDto: UpdateAdminDto) {
    if(!updateAdminDto || !matricule) throw new BadRequestException('Matricule and update data are required');
    const updateData = { ...updateAdminDto };
    // ✅ If password is present, hash it before saving
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const result = await this.AdminModel.updateOne(
      { matricule },
      { $set: updateData },
    ).exec();

    if (result.modifiedCount === 0) {
      throw new BadRequestException('Update failed: admin not found or no changes made');
    }

    return { message: 'Admin updated successfully' };
  }

  async remove(matricule: string) {
    if (!matricule) throw new BadRequestException('Matricule is required');
    return this.AdminModel.deleteOne({ matricule }).exec().then(result => {      
      if (result.deletedCount === 0) {
        throw new BadRequestException('Delete failed: admin not found');
      }
      return { message: 'Admin deleted successfully' };
    });
  }
}
