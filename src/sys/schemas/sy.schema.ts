import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({})
export class Sys extends Document {

  @Prop({required : true, unique: true})
  matricule !: string
  @Prop({required : true})
  password !: string

}

export const SysSchema = SchemaFactory.createForClass(Sys)