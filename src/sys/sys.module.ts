import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sys, SysSchema, } from './schemas/sy.schema';
import { RefreshToken, refreshTokenSchema } from 'src/auth/schema/refresh-token.schema';

@Module({
  imports: [
      MongooseModule.forFeature([{
          name : Sys.name,
          schema : SysSchema
        },
        {
          name: RefreshToken.name,
          schema: refreshTokenSchema
        }
      ])],
  controllers: [SysController],
  providers: [SysService],
})
export class SysModule {}
