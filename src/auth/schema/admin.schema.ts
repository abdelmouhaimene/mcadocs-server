import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({})
export class Admin extends Document {

  @Prop({required : true, unique: true})
  matricule !: string
  @Prop({required : true})
  nom !: string
  @Prop({required : true})
  prenom !: string
  @Prop({required : true})
  password !: string
  @Prop({required : true})
  role !: 'doc' | 'dir' | 'sys' 

}

export const adminSchema = SchemaFactory.createForClass(Admin)