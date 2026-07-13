FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build api-gateway

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist/apps/backend/api-gateway ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "main.js"]