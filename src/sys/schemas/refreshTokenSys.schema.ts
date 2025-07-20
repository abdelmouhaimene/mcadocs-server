import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({versionKey: false, timestamps: true})
export class RefreshTokenSys extends Document {

  @Prop({required : true})
  token !: string
  @Prop({required : true})
  matricule !: string
  @Prop({required : true})
  expDate !: Date
}

export const refreshTokenSysSchema = SchemaFactory.createForClass(RefreshTokenSys)