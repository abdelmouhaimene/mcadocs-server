import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sys, SysSchema, } from './schemas/sy.schema';
import { RefreshTokenSys, refreshTokenSysSchema } from './schemas/refreshTokenSys.schema';

@Module({
  imports: [
      MongooseModule.forFeature([{
          name : Sys.name,
          schema : SysSchema
        },
        {
          name: RefreshTokenSys.name,
          schema: refreshTokenSysSchema
        }
      ])],
  controllers: [SysController],
  providers: [SysService],
})
export class SysModule {}
