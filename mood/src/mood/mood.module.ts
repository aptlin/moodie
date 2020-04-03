import { Module, HttpModule } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoodSchema } from './shemas/mood';
import { ThemeSchema } from './shemas/theme';
import { ExperienceSchema } from './shemas/experience';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Mood', schema: MoodSchema },
      { name: 'Theme', schema: ThemeSchema },
      { name: 'Experience', schema: ExperienceSchema },
    ]),
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('http.timeout'),
        maxRedirects: configService.get<number>('http.maxRedirects'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
