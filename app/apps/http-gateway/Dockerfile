FROM node:24-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY . .

RUN npm run build http-gateway

FROM node:24-alpine3.21

WORKDIR /app

COPY --from=builder /app/dist/apps/http-gateway ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --only=production

CMD ["node", "dist/main.js"]
