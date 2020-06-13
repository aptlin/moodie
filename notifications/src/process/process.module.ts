import { Module } from '@nestjs/common';
import { ProcessController } from './process.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [ProcessController],
})
export class ProcessModule {}
