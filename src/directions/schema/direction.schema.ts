import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({timestamps: true, versionKey: false})
export class Direction extends Document {
  @Prop({required : true , unique : true})
  nom !: string
}

export const DirectionSchema = SchemaFactory.createForClass(Direction)
