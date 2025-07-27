import {Schema, SchemaFactory, Prop} from '@nestjs/mongoose'
import { Document } from 'mongoose'
@Schema({timestamps: true, versionKey: false})
export class Directeur extends Document {
    @Prop({required : true, unique : true, ref: 'admins', type: String})
    matricule !: string
    @Prop({required : true,ref: 'directions', type: String})
    direction !: string
}

export const DirecteurSchema = SchemaFactory.createForClass(Directeur)