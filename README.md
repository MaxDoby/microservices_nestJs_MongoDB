# Financial Tracker

Nx monorepo for a financial tracking application built with NestJS microservices,
RabbitMQ, MongoDB, and React microfrontends.

## Architecture

Backend:

- `api-gateway`: public HTTP API.
- `auth-service`: registration, login, and JWT validation.
- `financial-service`: income and expense transactions.
- `pdf-service`: reserved for future PDF reports.

Frontend:

- `shell`: React host application.
- `authMf`: authentication microfrontend.
- `financialMf`: financial tracking microfrontend.
- `reportsMf`: reports microfrontend.

Shared libraries:

- `libs/shared/contracts`: shared DTOs and message patterns.
- `libs/shared/types`: simple shared TypeScript types.

## Requirements

- Node.js
- npm
- Docker Desktop

## Environment

Create a local `.env` file from `.env.example`.

Required variables:

```env
AUTH_MONGO_URI=mongodb://root:root@localhost:27017/financial-tracker-auth?authSource=admin
FINANCIAL_MONGO_URI=mongodb://root:root@localhost:27017/financial-tracker-financial?authSource=admin
RABBITMQ_URL=amqp://root:root@localhost:5673
JWT_SECRET=change_me
JWT_EXPIRES_IN=86400
```

## Start Infrastructure

```sh
docker compose up -d
```

MongoDB runs on `localhost:27017`.

RabbitMQ runs on `localhost:5673`.

RabbitMQ Management UI runs on `http://localhost:15673`.

## Start Backend Services

Run each command in a separate terminal:

```sh
npx nx serve auth-service
```

```sh
npx nx serve financial-service
```

```sh
npx nx serve api-gateway
```

The API Gateway runs on:

```txt
http://localhost:3000/api
```

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/validate-token`

Transactions:

- `POST /api/transactions`
- `GET /api/transactions`

Transaction routes require:

```txt
Authorization: Bearer <token>
```

## Verify Project

```sh
npx nx run-many -t build --all
npx nx run-many -t lint --all
npx nx run-many -t test --all
```

## Notes

E2E projects were intentionally removed for now. They will be added back after
the core backend and frontend flows are complete.
