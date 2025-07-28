import { Module } from '@nestjs/common';
import { DemandesService } from './demandes.service';
import { DemandesController } from './demandes.controller';

@Module({
  controllers: [DemandesController],
  providers: [DemandesService],
})
export class DemandesModule {}
