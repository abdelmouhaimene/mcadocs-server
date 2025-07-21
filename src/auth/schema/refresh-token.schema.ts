import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import  { Document } from 'mongoose'
@Schema({versionKey: false, timestamps: true})
export class RefreshToken extends Document {

  @Prop({required : true})
  token !: string
  @Prop({required : true})
  matricule !: string
  @Prop({required : true})
  expDate !: Date
}

export const refreshTokenSchema = SchemaFactory.createForClass(RefreshToken)