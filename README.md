# Financial Tracker

Nx monorepo for a financial tracking application built with NestJS
microservices, RabbitMQ, MongoDB, Docker, Zod contracts and React
microfrontends.

## Architecture

Backend:

- `api-gateway`: public HTTP API, Swagger documentation, guards and HTTP to
  RabbitMQ orchestration.
- `auth-service`: registration, login, logout, refresh token handling and JWT
  validation.
- `financial-service`: transaction storage, listing, deletion and financial
  report calculations.
- `pdf-service`: PDF generation from calculated financial report data.
- `audit-service`: audit logs for important user actions.

Frontend:

- `shell`: React host application.
- `authMf`: authentication microfrontend exposed as a DOM Custom Element.
- `financialMf`: transaction microfrontend exposed as a DOM Custom Element.
- `reportsMf`: report microfrontend exposed as a DOM Custom Element.

Shared libraries:

- `libs/contracts`: Zod-first contracts, inferred TypeScript types and RabbitMQ
  message patterns shared by backend services and frontend applications.
- `libs/frontend-auth`: shared frontend authentication helper for authenticated
  requests, token refresh and logout.

## Contracts And DTO Strategy

The project uses Zod contracts as the shared source for data shape between
frontend and backend services.

`libs/contracts` contains:

- request and response schemas;
- inferred TypeScript types;
- RabbitMQ message patterns;
- shared constants such as transaction categories and report periods.

The `api-gateway` keeps NestJS DTO classes for the HTTP layer, but request and
query DTOs are generated from Zod schemas with `nestjs-zod`. These DTOs are used
for:

- Swagger/OpenAPI metadata;
- `ZodValidationPipe` request validation;
- controller method typing for public HTTP endpoints.

This means Zod contracts are the source of truth for input validation and shared
TypeScript inference, while DTO classes are thin NestJS HTTP adapters. Response
DTOs remain as explicit Swagger documentation models where that is clearer for
the generated API documentation.

## Microfrontend Contracts

The shell composes frontend providers through DOM Custom Elements loaded by
Module Federation at runtime.

| Provider | DOM element | Remote expose | Responsibility |
| --- | --- | --- | --- |
| `authMf` | `<ft-auth>` | `authMf/element` | Login/register UI and authentication event emission |
| `financialMf` | `<ft-transactions>` | `financialMf/element` | Transaction creation, listing, pagination and deletion |
| `reportsMf` | `<ft-reports>` | `reportsMf/element` | Financial report generation and PDF download |

Auth events:

| Event | Emitted by | Consumed by | Purpose |
| --- | --- | --- | --- |
| `ft:auth:authenticated` | `<ft-auth>` | `shell` | Notifies shell that login/register succeeded |

## Requirements

- Node.js
- npm
- Docker Desktop

## Environment

Create a local `.env` file from `.env.example`.

For Docker backend development, `.env.docker.example` contains only the values
that are consumed by Docker Compose and the local Vite frontends.

Required variables:

```env
AUTH_MONGO_URI=mongodb://root:root@localhost:27017/financial-tracker-auth?authSource=admin
FINANCIAL_MONGO_URI=mongodb://root:root@localhost:27017/financial-tracker-financial?authSource=admin
PDF_MONGO_URI=mongodb://root:root@localhost:27017/financial-tracker-pdf?authSource=admin
AUDIT_MONGO_URI=mongodb://root:root@localhost:27017/financial-tracker-audit?authSource=admin
RABBITMQ_URL=amqp://root:root@localhost:5673

JWT_SECRET=dev_secret_change_me
JWT_EXPIRES_IN=86400
BCRYPT_SALT_ROUNDS=12

CORS_ORIGINS=http://localhost:4200,http://127.0.0.1:4200

VITE_API_URL=http://localhost:3000/api
VITE_AUTH_MF_URL=http://localhost:5101/remoteEntry.js
VITE_FINANCIAL_MF_URL=http://localhost:5102/remoteEntry.js
VITE_REPORTS_MF_URL=http://localhost:5103/remoteEntry.js
```

## Recommended Local Development

For the simplest development flow, run the backend stack in Docker and the
frontend microfrontends locally with Vite:

```sh
npm run dev:docker
```

This starts the Docker backend stack first:

- MongoDB;
- RabbitMQ;
- `api-gateway`;
- `auth-service`;
- `financial-service`;
- `pdf-service`;
- `audit-service`.

Then it starts all frontend microfrontends locally.

The shell application runs on:

```txt
http://localhost:4200
```

The API Gateway runs on:

```txt
http://localhost:3000/api
```

Swagger API documentation runs on:

```txt
http://localhost:3000/api/docs
```

RabbitMQ Management UI runs on:

```txt
http://localhost:15673
```

Stop the full Docker stack:

```sh
npm run docker:down
```

If the backend stack is already running and you only need the frontend:

```sh
npm run dev
```

## Backend Local Debug Mode

Use this mode when debugging backend services locally instead of running the
backend services in Docker.

Start only infrastructure:

```sh
npm run infra:up
```

Start backend services locally:

```sh
npm run dev:backend:local
```

Start frontend services locally:

```sh
npm run dev
```

Stop infrastructure:

```sh
npm run infra:down
```

## Individual Service Commands

Backend:

```sh
npm run serve:auth
npm run serve:financial
npm run serve:pdf
npm run serve:audit
npm run serve:api
```

Frontend:

```sh
npm run serve:auth-mf
npm run serve:financial-mf
npm run serve:reports-mf
npm run serve:shell
```

## API Endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `POST /api/auth/validate-token`

Transactions:

- `POST /api/transactions`
- `GET /api/transactions?page=1&limit=20`
- `DELETE /api/transactions`
- `GET /api/transactions/report?period=annual&startDate=2026-01-01&endDate=2026-12-31`
- `GET /api/transactions/report/pdf?period=annual&startDate=2026-01-01&endDate=2026-12-31`

Protected transaction and report routes require:

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
npm run api-contracts:check
npm run build:all
npm run lint:all
npm run test:backend
```

Backend coverage:

```sh
npx nx run-many -t test --projects=auth-service,financial-service,api-gateway,pdf-service,audit-service,api-gateway-e2e --coverage --coverageReporters=text-summary --runInBand
```

HTML coverage reports are generated under:

```txt
coverage/apps/backend/<project-name>/index.html
```

## Testing

Backend unit tests cover:

- `auth-service`;
- `financial-service`;
- `api-gateway`;
- `pdf-service`;
- `audit-service`.

API E2E tests are implemented in:

```txt
apps/backend/api-gateway-e2e
```

The E2E suite starts a real Nest HTTP application with API Gateway controllers,
guards and Zod validation pipe, while mocking internal RabbitMQ microservice
communication.
