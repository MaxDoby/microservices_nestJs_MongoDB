import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './app/auth.module';

async function bootstrap() {
  const rabbitMqUrl = process.env.RABBITMQ_URL;

  if (!rabbitMqUrl) {
    throw new Error('RABBITMQ_URL is required.');
  }

  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'auth_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();

  Logger.log('Auth service is listening for RabbitMQ messages');
}

bootstrap();
