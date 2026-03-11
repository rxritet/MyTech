# Stage 1: install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# Stage 2: production runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY api ./api
COPY drizzle ./drizzle
COPY drizzle.config.ts .
COPY tsconfig.json .
COPY package.json .

EXPOSE 3000
CMD ["sh", "-c", "npm run migrate && npm run start"]
