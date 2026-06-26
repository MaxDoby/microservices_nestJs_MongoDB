import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { FinancialModule } from './app/financial.module';

async function bootstrap() {
  const rabbitMqUrl = process.env.RABBITMQ_URL;

  if (!rabbitMqUrl) throw new Error('RABBITMQ_URL is not provided.');

  const app = await NestFactory.createMicroservice(FinancialModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'financial_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();

  Logger.log('Financial service is listening for Rabbit`s messages.');
}

bootstrap();
