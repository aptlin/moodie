import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { BullModule } from '@nestjs/bull';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'verification',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('queues.verification.cache.host'),
          port: +configService.get<number>('queues.verification.cache.port'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
