# Financial Tracker

Nx monorepo for a financial tracking application built with NestJS microservices,
RabbitMQ, MongoDB, and React microfrontends.

## Architecture

Backend:

- `api-gateway`: public HTTP API.
- `auth-service`: registration, login, and JWT validation.
- `financial-service`: income and expense transactions.
- `pdf-service`: generates PDF reports from financial report data.

Frontend:

- `shell`: React host application.
- `authMf`: authentication microfrontend.
- `financialMf`: financial tracking microfrontend.
- `reportsMf`: reports microfrontend.

Shared libraries:

- `libs/contracts`: shared DTOs and message patterns.
- `libs/types`: simple shared TypeScript types.

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
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS=http://localhost:4200,http://127.0.0.1:4200

VITE_API_URL=http://localhost:3000/api
VITE_AUTH_MF_URL=http://localhost:5101/remoteEntry.js
VITE_FINANCIAL_MF_URL=http://localhost:5102/remoteEntry.js
VITE_REPORTS_MF_URL=http://localhost:5103/remoteEntry.js


```

## Start Backend With Docker

```sh
npm run infra:up
```

This starts MongoDB, RabbitMQ and all backend services:

- `api-gateway`
- `auth-service`
- `financial-service`
- `pdf-service`
- `audit-service`

MongoDB runs on `localhost:27017`.

RabbitMQ runs on `localhost:5673`.

RabbitMQ Management UI runs on `http://localhost:15673`.

The API Gateway runs on:

```txt
http://localhost:3000/api
```

Swagger API documentation runs on:

```txt
http://localhost:3000/api/docs
```

To stop the backend stack:

```sh
npm run infra:down
```

## Start Backend Services Manually

Use this mode when debugging a specific backend service outside Docker. MongoDB
and RabbitMQ must still be running.

```sh
npm run serve:auth
```

```sh
npm run serve:financial
```

```sh
npm run serve:pdf
```

```sh
npm run serve:audit
```

```sh
npm run serve:api
```

The Swagger page documents public controllers, request DTO properties, response
schemas, Bearer authorization, and common error statuses.

## Start Frontend Services

Run each command in a separate terminal:

```sh
npm run serve:auth-mf
```

```sh
npm run serve:financial-mf
```

```sh
npm run serve:reports-mf
```

```sh
npm run serve:shell
```

The shell application runs on:

```txt
http://localhost:4200
```

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/validate-token`

Transactions:

- `POST /api/transactions`
- `GET /api/transactions?page=1&limit=20`
- `DELETE /api/transactions`
- `GET /api/transactions/report?period=annual&startDate=2026-01-01&endDate=2026-12-31`
- `GET /api/transactions/report/pdf?period=annual&startDate=2026-01-01&endDate=2026-12-31`

Transaction routes require:

```txt
Authorization: Bearer <token>
```

Financial workspace access:

- Every authenticated user can see, report and delete all transactions.
- `userId` is still stored on created transactions as the creator/audit field.
- Role-based permissions can be added later on top of this shared workspace
  model.

Delete transactions request body:

```json
{
  "transactionIds": ["6a42891dde452d8eb08ec154"]
}
```

The transactions page loads 20 items per page and the API returns pagination
metadata together with the transaction list.

## Verify Project

```sh
npm run build:all
npm run lint:all
npx nx run-many -t test --all
```

## Notes

E2E projects were intentionally removed for now. They will be added back after
the core backend and frontend flows are complete.
