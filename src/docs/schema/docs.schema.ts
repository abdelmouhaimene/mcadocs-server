import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({timestamps: true })
export class Doc extends Document {

  @Prop({required : true, unique: true})
  code !: string
  @Prop({required : true})
  nom !: string
  @Prop({required : true})
  version !: string
  @Prop({required : true})
  description !: string 
  @Prop({required : true, ref: 'directeur', type: String})
  creePar !: string
  @Prop({required : true , ref: 'directeur', type: String})
  validePar !: string
  @Prop({required : true})
  path !: string
}

export const DocSchema = SchemaFactory.createForClass(Doc)