import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PdfModule } from './app/pdf.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PdfModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5673'],
        queue: process.env.PDF_QUEUE ?? 'pdf_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();

  Logger.log('PDF service is listening for RabbitMQ messages');
}

bootstrap();
