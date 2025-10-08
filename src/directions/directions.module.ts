import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Direction, DirectionSchema } from './schema/direction.schema';
import { Directeur, DirecteurSchema } from './schema/directeur.schema';
import { Admin, adminSchema } from 'src/admins/schema/admin.schema';
@Module({
    imports: [
      MongooseModule.forFeature([{
          name : Directeur.name,
          schema : DirecteurSchema
        },
        {
          name: Direction.name,
          schema: DirectionSchema
        },
        {
          name: Admin.name,
          schema: adminSchema
        }
      ])],
  controllers: [DirectionsController],
  providers: [DirectionsService],
})
export class DirectionsModule {}
