/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuditModule } from './app/audit.module';

async function bootstrap() {
  const rabbitMqUrl = process.env.RABBITMQ_URL;

  if (!rabbitMqUrl) {
    throw new Error('RABBITMQ_URL is required.');
  }

  const app = await NestFactory.createMicroservice(AuditModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'audit_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();

  Logger.log(`Audit service listening for RabbitMQ messages.`);
}

bootstrap();
