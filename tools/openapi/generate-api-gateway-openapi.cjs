const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

process.env.RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:4200';

require('ts-node').register({
  transpileOnly: true,
  project: path.join(projectRoot, 'apps/backend/api-gateway/tsconfig.app.json'),
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
  },
});

require('tsconfig-paths').register({
  baseUrl: projectRoot,
  paths: {
    '@financial-tracker/contracts': ['libs/contracts/src/index.ts'],
    '@financial-tracker/frontend-auth': ['libs/frontend-auth/src/index.ts'],
  },
});

const { NestFactory } = require('@nestjs/core');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const { cleanupOpenApiDoc } = require('nestjs-zod');
const {
  ApiGatewayModule,
} = require('../../apps/backend/api-gateway/src/app/api-gateway.module.ts');

const outputPath = path.join(
  projectRoot,
  'tmp/openapi/api-gateway.openapi.json',
);

const generateOpenApi = async () => {
  const app = await NestFactory.create(ApiGatewayModule, {
    logger: false,
  });

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Financial Tracker API')
    .setDescription(
      'Public HTTP API for authentication, transaction management, financial reports and PDF report downloads.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Send access token as Authorization: Bearer <token>.',
    })
    .build();

  const openApiDocument = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));

  await app.close();

  console.log(`OpenAPI generated: ${outputPath}`);
};

generateOpenApi().catch((error) => {
  console.error(error);
  process.exit(1);
});
