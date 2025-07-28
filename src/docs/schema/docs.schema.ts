import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({})
export class Doc extends Document {

  @Prop({required : true, unique: true})
  code !: string
  @Prop({required : true})
  nom !: string
  @Prop({required : true})
  DateDeCreation !: Date
  @Prop({required : true})
  password !: string
  @Prop({required : true})
  role !: 'doc' | 'dir' | 'sys' 

}

export const DocSchema = SchemaFactory.createForClass(Doc)