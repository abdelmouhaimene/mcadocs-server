// document.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Demande extends Document {
  @Prop({ required: true, unique: true })
  nom !: string;

  @Prop({ required: true, ref: 'directeur', type: String})
  matricule !: string;

  @Prop({ required: true, default : false })
  consulte !: boolean;


  // Option 1: Store PDF as binary data
  // @Prop({ type: Buffer })
  // file !: Buffer;

  // @Prop()
  // mimetype !: string;

  // Option 2 !: Store file path (if saving to disk/cloud)
  @Prop()
  filePath !: string;

  @Prop({ required: true })  // Add this
  mimetype !: string;

  @Prop()
  size !: number;
}

export const DemandeSchema = SchemaFactory.createForClass(Demande);