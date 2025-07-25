import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({timestamps: true, versionKey: false})
export class Directeur extends Document {
    @Prop({required : true})
    matricule !: string
    @Prop({required : true})
    Direction !: string
}

export const DirecteurSchema = SchemaFactory.createForClass(Directeur)