import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
@Schema({timestamps: true, versionKey: false})
export class Directeur extends Document {
    @Prop({required : true})
    matricule !: string
    @Prop({required : true, type: mongoose.Schema.Types.ObjectId, ref: 'Directeur'})
    Directeur !: mongoose.Schema.Types.ObjectId
}

export const DirecteurSchema = SchemaFactory.createForClass(Directeur)