import { Module } from '@nestjs/common';
import { ExperienceController } from './experience.controller';

@Module({
  controllers: [ExperienceController]
})
export class ExperienceModule {}
