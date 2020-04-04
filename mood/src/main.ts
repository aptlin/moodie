import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  const options = new DocumentBuilder()
    .setTitle('Mood')
    .setDescription('The mood API for Moodie')
    .setVersion('1.0')
    .addTag('mood')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('mood/api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('port');
  await app.listen(port);
}

bootstrap();
