import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Direction, DirectionSchema } from './schema/direction.schema';
import { Directeur, DirecteurSchema } from './schema/directeur.schema';
@Module({
    imports: [
      MongooseModule.forFeature([{
          name : Directeur.name,
          schema : DirecteurSchema
        },
        {
          name: Direction.name,
          schema: DirectionSchema
        }
      ])],
  controllers: [DirectionsController],
  providers: [DirectionsService],
})
export class DirectionsModule {}
