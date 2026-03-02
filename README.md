# MyTech

> **Сайт-визитка разработчика** — production-ready портфолио с формой обратной связи, REST API и PostgreSQL, развёртываемое одной командой.

![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Bun](https://img.shields.io/badge/Runtime-Bun-black?logo=bun)
![Hono](https://img.shields.io/badge/API-Hono-orange)
![React](https://img.shields.io/badge/UI-React%2018-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL%2016-336791?logo=postgresql&logoColor=white)

---

## Содержание

- [О проекте](#о-проекте)
- [Стек технологий](#стек-технологий)
- [Структура проекта](#структура-проекта)
- [Быстрый старт (Docker)](#быстрый-старт-docker)
- [Переменные среды](#переменные-среды)
- [API](#api)
- [Локальная разработка](#локальная-разработка)
- [Скрипты](#скрипты)
- [Соглашения о коммитах](#соглашения-о-коммитах)
- [Лицензия](#лицензия)

---

## О проекте

**MyTech** — персональный сайт-визитка разработчика.

- 📋 Форма обратной связи (имя, e-mail, сообщение) с валидацией на стороне клиента и сервера
- 📬 Данные сохраняются в PostgreSQL через REST API
- 🐳 Всё приложение запускается одной командой `docker compose up`
- ♿ Разметка соответствует критериям доступности WCAG (метки, aria-атрибуты, семантические теги)

---

## Стек технологий

| Слой | Технология |
|---|---|
| Фронтенд | React 18 + TypeScript + Vite + Tailwind CSS |
| Бэкенд | Bun + Hono + TypeScript |
| ORM / Миграции | Drizzle ORM + Drizzle Kit |
| База данных | PostgreSQL 16 |
| Контейнеризация | Docker + Docker Compose |
| Веб-сервер (prod) | nginx (SPA + reverse proxy) |

---

## Структура проекта

```
MyTech/
├── compose.yml            # Docker Compose (db, backend, frontend)
├── .env.example           # Шаблон переменных среды
├── README.md
├── TZ.md                  # Техническое задание
│
├── backend/
│   ├── src/
│   │   ├── index.ts       # Точка входа Hono-сервера
│   │   ├── routes/
│   │   │   └── contact.ts # CRUD-роуты /api/contacts
│   │   └── db/
│   │       ├── client.ts  # Drizzle + postgres-js
│   │       ├── schema.ts  # Схема таблицы contacts
│   │       └── migrate.ts # Запуск миграций
│   ├── drizzle/
│   │   └── migrations/    # SQL-миграции (версионируются в git)
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
└── frontend/
    ├── src/
    │   ├── App.tsx         # Главный компонент (форма + список)
    │   ├── api.ts          # HTTP-клиент
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── index.html
    ├── vite.config.ts
    ├── nginx.conf          # nginx для production-образа
    ├── package.json
    ├── tsconfig.json
    └── Dockerfile
```

---

## Быстрый старт (Docker)

**Требования:** Docker Desktop (или Docker Engine + Compose plugin).

```bash
# 1. Клонировать репозиторий
git clone https://github.com/rxritet/MyTech.git
cd MyTech

# 2. Создать файл с переменными среды
cp .env.example .env
# Отредактировать .env при необходимости

# 3. Собрать и запустить все сервисы
docker compose up --build -d

# 4. Открыть сайт
#    http://localhost:5173
```

Остановка:

```bash
docker compose down
# Удалить данные БД:
docker compose down -v
```

---

## Переменные среды

Файл `.env` (создаётся из `.env.example`, **никогда не коммитится**):

| Переменная | По умолчанию | Описание |
|---|---|---|
| `POSTGRES_USER` | `mytech` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | `secret` | Пароль PostgreSQL |
| `POSTGRES_DB` | `mytech` | Имя базы данных |
| `DATABASE_URL` | `postgresql://mytech:secret@db:5432/mytech` | Connection string для бэкенда |
| `PORT` | `3000` | Порт Hono-сервера |

> ⚠️ Файл `.env` добавлен в `.gitignore`. Никогда не публикуйте реальные пароли.

---

## API

Базовый URL: `http://localhost:3000` (напрямую) или `http://localhost:5173` (через nginx-прокси).

### GET /health

Проверка работоспособности сервера.

```bash
curl http://localhost:5173/health
```

**Ответ 200:**
```json
{ "status": "ok" }
```

---

### POST /api/contacts

Создать новую запись обратной связи.

```bash
curl -X POST http://localhost:5173/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","email":"ivan@example.com","message":"Привет!"}'
```

**Тело запроса:**
| Поле | Тип | Ограничения |
|---|---|---|
| `name` | string | обязательно, 1–100 символов |
| `email` | string | обязательно, валидный e-mail, макс. 254 символа |
| `message` | string | обязательно, 5–2000 символов |

**Ответ 201:**
```json
{
  "id": 1,
  "name": "Иван",
  "email": "ivan@example.com",
  "message": "Привет!",
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

**Ответ 400** (ошибка валидации или некорректный JSON):
```json
{ "error": "Validation failed", "details": [...] }
```

---

### GET /api/contacts

Получить все записи обратной связи.

```bash
curl http://localhost:5173/api/contacts
```

**Ответ 200:**
```json
[
  {
    "id": 1,
    "name": "Иван",
    "email": "ivan@example.com",
    "message": "Привет!",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
]
```

---

## Локальная разработка

Для запуска без Docker нужны: **Bun ≥ 1.0**, **Node.js ≥ 18**, **pnpm**, **PostgreSQL**.

### Бэкенд

```bash
cd backend
bun install
# Создать .env с DATABASE_URL указывающим на локальный PostgreSQL
bun run migrate   # применить миграции
bun run dev       # dev-сервер с hot reload на :3000
```

### Фронтенд

```bash
cd frontend
pnpm install
pnpm dev          # Vite dev-сервер на :5173 (proxy → :3000)
```

---

## Скрипты

### backend/

| Команда | Описание |
|---|---|
| `bun run dev` | Dev-сервер с hot reload |
| `bun run start` | Production-запуск |
| `bun run migrate` | Применить миграции Drizzle |
| `bun run generate` | Сгенерировать новую миграцию |
| `bun run typecheck` | Проверить типы (`tsc --noEmit`) |

### frontend/

| Команда | Описание |
|---|---|
| `pnpm dev` | Vite dev-сервер |
| `pnpm build` | Production-сборка в `dist/` |
| `pnpm preview` | Предпросмотр production-сборки |
| `pnpm lint` | ESLint проверка |
| `pnpm typecheck` | Проверить типы (`tsc --noEmit`) |

---

## Соглашения о коммитах

Проект следует [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/):

| Префикс | Назначение |
|---|---|
| `feat:` | Новая функциональность |
| `fix:` | Исправление ошибки |
| `docs:` | Изменения в документации |
| `chore:` | Конфигурация, зависимости |
| `refactor:` | Рефакторинг без изменения поведения |
| `infra:` | Docker, CI/CD, инфраструктура |

---

## Лицензия

[MIT](https://opensource.org/licenses/MIT)
