import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, adminSchema } from './schema/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
    name : Admin.name,
    schema : adminSchema
  }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
