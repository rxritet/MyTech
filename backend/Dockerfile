# Stage 1: install dependencies
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Stage 2: production runner
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts .
COPY package.json .

EXPOSE 3000
CMD ["sh", "-c", "bun run migrate && bun run start"]
