import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [ExperienceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
