import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, adminSchema } from '../admins/schema/admin.schema';
import { RefreshToken, refreshTokenSchema } from './schema/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
        name : Admin.name,
        schema : adminSchema
      },
      {
        name: RefreshToken.name,
        schema: refreshTokenSchema
      }
    ])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
