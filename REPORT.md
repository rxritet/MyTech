# Отчёт о проделанной работе — MyTech

## Общая сводка

| Параметр | Значение |
|---|---|
| Репозиторий | https://github.com/rxritet/MyTech |
| Ветка | `main` |
| Всего новых файлов | 25 |
| Всего добавленных строк | ~2 997 |
| Новых коммитов | 3 |

---

## Сделанное по разделам

### 1. Инфраструктура (`compose.yml`)

Обновлён файл `compose.yml`: к существующему сервису `db` добавлены сервисы `backend` и `frontend`.

**Итоговая конфигурация Docker Compose:**

| Сервис | Образ / Сборка | Порт | Зависимость |
|---|---|---|---|
| `db` | `postgres:16-alpine` | 5432 | — |
| `backend` | `./backend` (Dockerfile) | 3000 | `db` (healthcheck) |
| `frontend` | `./frontend` (Dockerfile) | 5173→80 | `backend` |

- `db` имеет `healthcheck` через `pg_isready`
- `backend` стартует только после `service_healthy` у `db`
- PostgreSQL-данные персистентны через `named volume` `mytech_pgdata`

---

### 2. Backend (`backend/`)

**Стек:** Bun 1.2 · Hono · TypeScript (strict) · Drizzle ORM · Zod · PostgreSQL 16

#### Созданные файлы

| Файл | Назначение |
|---|---|
| `src/index.ts` | Точка входа: Hono-приложение, CORS, `/health`, подключение роутера |
| `src/routes/contact.ts` | `POST /api/contacts` (создание) и `GET /api/contacts` (список) |
| `src/db/schema.ts` | Drizzle-схема таблицы `contacts` (id, name, email, message, created_at) |
| `src/db/client.ts` | Инициализация Drizzle + postgres-клиента |
| `src/db/migrate.ts` | Скрипт применения миграций (`bun run migrate`) |
| `drizzle.config.ts` | Конфиг Drizzle Kit (dialect, schema, output) |
| `package.json` | Зависимости и скрипты (`dev`, `start`, `generate`, `migrate`, `typecheck`) |
| `tsconfig.json` | TypeScript strict + `skipLibCheck` + Bun-types |
| `Dockerfile` | Multi-stage build (deps → runner) на `oven/bun:1.2-alpine` |
| `.dockerignore` | Исключает `node_modules`, `.env` |
| `drizzle/migrations/.gitkeep` | Папка для SQL-миграций |

#### API-эндпоинты

| Метод | Путь | Описание | Код |
|---|---|---|---|
| GET | `/health` | Проверка работоспособности | 200 |
| POST | `/api/contacts` | Создать обращение (Zod-валидация) | 201 |
| GET | `/api/contacts` | Список всех обращений | 200 |

#### Схема БД

```sql
CREATE TABLE contacts (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Установленные зависимости

```
hono, drizzle-orm, postgres, zod, dotenv
@types/bun, drizzle-kit, typescript
```

---

### 3. Frontend (`frontend/`)

**Стек:** Node.js 22 · pnpm · React 19 · TypeScript (strict) · Vite · Tailwind CSS v4

#### Созданные файлы

| Файл | Назначение |
|---|---|
| `src/App.tsx` | Основной компонент: Hero, About, Contact-форма |
| `src/api.ts` | Функции `submitContact()` и `getContacts()` для работы с API |
| `src/main.tsx` | Точка входа React (`createRoot`) |
| `src/index.css` | Подключение Tailwind CSS v4 (`@import "tailwindcss"`) |
| `src/vite-env.d.ts` | Reference-тип `vite/client` для `import.meta.env` |
| `index.html` | HTML-шаблон с `<title>MyTech</title>` и `<meta name="description">` |
| `vite.config.ts` | Плагины React + Tailwind, proxy `/api` и `/health` → `localhost:3000` |
| `tsconfig.json` | TypeScript strict, `react-jsx`, `bundler` moduleResolution |
| `package.json` | Зависимости и скрипты (`dev`, `build`, `lint`, `typecheck`) |
| `Dockerfile` | Multi-stage: deps → build (Vite) → runner (nginx:alpine) |
| `nginx.conf` | SPA-роутинг (`try_files`) + reverse proxy на `/api/` и `/health` |
| `.dockerignore` | Исключает `node_modules`, `dist`, `.env` |

#### Реализованный UI

- **Hero-секция:** имя, должность, город, теги навыков (Go, Bun, Hono, PostgreSQL, Docker, React, TypeScript), CTA-кнопка со скроллом к форме
- **About-секция:** описание разработчика
- **Contact-секция:** форма с полями `name`, `email`, `message`; HTML5-валидация; inline-сообщение после отправки (`✅` / `❌`); без перезагрузки страницы
- Семантическая разметка: `<main>`, `<section>`, `<h1>`, `<h2>`, `<footer>`

---

### 4. Исправленные ошибки (TypeScript)

| Файл | Проблема | Решение |
|---|---|---|
| `backend/tsconfig.json` | `"bun-types"` не находился | Исправлено на `"bun"` (соответствует `@types/bun`) |
| `backend/tsconfig.json` | Ошибки внутри `node_modules` drizzle-orm с TS 5.9 | Добавлен `"skipLibCheck": true` |
| `frontend/src/vite-env.d.ts` | `import.meta.env` не типизировано | Создан файл с `/// <reference types="vite/client" />` |
| `backend/node_modules` | Зависимости не установлены | Выполнен `bun install` |
| `frontend/node_modules` | Зависимости не установлены | Выполнен `pnpm install` |

**Результат:** `tsc --noEmit` — 0 ошибок в обоих проектах.

---

### 5. Git-история

```
3bd1616  feat(frontend): add React 19 + Vite + Tailwind CSS v4 portfolio UI
33aec82  feat(backend): add Hono API with Drizzle ORM, Zod validation and PostgreSQL
011fe75  feat(infra): add Docker Compose with db, backend, frontend services
d693c46  docs: add TZ, .env.example and .gitignore
241c5b9  feat: init project — add README
```

Все коммиты запущены в `origin/main` → https://github.com/rxritet/MyTech

---

## Что осталось до MVP

- [ ] `bun run generate` — сгенерировать SQL-миграции (Drizzle Kit)
- [ ] `docker compose up --build -d` — поднять все 3 сервиса
- [ ] Проверить форму: отправка → запись в PostgreSQL → `GET /api/contacts`
- [ ] Заполнить `README.md` инструкцией запуска
