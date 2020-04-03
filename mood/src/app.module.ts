import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoodModule } from './mood/mood.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.host'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    MoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
