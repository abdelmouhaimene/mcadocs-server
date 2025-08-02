import { Module } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { Doc, DocSchema } from './schema/docs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Directeur, DirecteurSchema } from 'src/directions/schema/directeur.schema';
import { Direction, DirectionSchema } from 'src/directions/schema/direction.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        {
          name : Doc.name,
          schema : DocSchema
        },
        {
          name: Directeur.name,
          schema: DirecteurSchema, 
        },
        {
          name: Direction.name,
          schema: DirectionSchema, 
        },
      ]),
    ],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
