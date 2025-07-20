import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ 
    // MongooseModule.forRootAsync({
    //   useFactory:  () => ({
    //     uri: 'mongodb://localhost:27017/MCADOCS',
    //   }),
    // })
    MongooseModule.forRoot(
      // {connectionName : 'mongodb://localhost:27017/MCADOCS'}
      'mongodb://localhost:27017/MCADOCS'
    ),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
