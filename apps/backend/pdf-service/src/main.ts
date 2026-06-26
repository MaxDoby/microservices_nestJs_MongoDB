import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PdfModule } from './app/pdf.module';

async function bootstrap() {
  const app = await NestFactory.create(PdfModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `PDF service is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
