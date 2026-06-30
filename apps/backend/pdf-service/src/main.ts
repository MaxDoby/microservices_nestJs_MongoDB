import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PdfModule } from './app/pdf.module';

const rabbitMqUrl = process.env.RABBITMQ_URL;

if (!rabbitMqUrl) {
  throw new Error('RABBITMQ_URL is required.');
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PdfModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: 'pdf_queue',
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
