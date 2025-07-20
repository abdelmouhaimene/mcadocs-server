import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
@Schema({versionKey: false, timestamps: true})
export class RefreshToken extends Document {

  @Prop({required : true})
  token !: string
  @Prop({required : true, type : mongoose.Schema.Types.ObjectId, ref: 'Admin'})
  userId !: mongoose.Types.ObjectId
  @Prop({required : true})
  expDate !: Date
}

export const refreshTokenSchema = SchemaFactory.createForClass(RefreshToken)