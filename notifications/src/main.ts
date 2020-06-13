import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Notifications')
    .setDescription('The notifications API for Moodie')
    .setVersion('1.0')
    .addTag('notifications')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('notifications/api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');

  console.log(configService.get('queues.verification.host'));
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('queues.verification.host')],
      queue: configService.get('queues.verification.name'),
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(port);
}

bootstrap();
