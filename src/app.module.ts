import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminsModule } from './admins/admins.module';
import { DirectionsModule } from './directions/directions.module';
import config from './config/config'; 
@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory:  (config) => ({
        uri: config.get('db.host'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory:  (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global : true,
      inject: [ConfigService],
    }),
    AuthModule,
    AdminsModule,
    DirectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
