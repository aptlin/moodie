import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import { ProcessModule } from './process/process.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    MessageModule,
    ProcessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
