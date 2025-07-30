import { Module } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { DemandesController } from './demandes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Demande,DemandeSchema } from './schema/demandes.schama';
import { Directeur, DirecteurSchema } from 'src/directions/schema/directeur.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name : Demande.name,
        schema : DemandeSchema
      },
      {
        name: Directeur.name,
        schema: DirecteurSchema, 
      }
    ]),
  ],
  controllers: [DemandesController],
  providers: [DemandesService],
})
export class DemandesModule {}
