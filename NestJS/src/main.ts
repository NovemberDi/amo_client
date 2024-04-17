import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use('/', express.static('test.html'));
  app.useStaticAssets(join(__dirname, './test.html', 'public'));
  app.enableCors({
    origin: [
      'http://localhost:5173',
    ],
    methods: ["GET", "POST"],
    credentials: true,
  });
  await app.listen(3052); 
}
bootstrap();