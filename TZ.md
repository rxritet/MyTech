# Техническое задание — MyTech

## 1. Общая информация

| Поле | Значение |
|---|---|
| Название проекта | MyTech |
| Тип | Сайт-визитка (портфолио разработчика) |
| Репозиторий | https://github.com/rxritet/MyTech |
| Статус | В разработке |
| Версия ТЗ | 1.0.0 |

## 2. Цель проекта

Создать production-ready сайт-визитку разработчика с формой обратной связи, развёрнутый через Docker Compose. Проект используется как портфолио и демонстрирует владение современным TypeScript-стеком.

## 3. Стек технологий

### 3.1 Frontend
- **Runtime:** Node.js 22 + pnpm
- **Фреймворк:** React 19
- **Язык:** TypeScript (strict mode)
- **Сборщик:** Vite
- **Стили:** Tailwind CSS v4
- **Принципы:** только функциональные компоненты, хуки, no `any`

### 3.2 Backend
- **Runtime:** Bun >= 1.2
- **Фреймворк:** Hono
- **Язык:** TypeScript (strict mode)
- **Валидация:** Zod
- **ORM:** Drizzle ORM
- **База данных:** PostgreSQL 16

### 3.3 Инфраструктура
- **Контейнеризация:** Docker + Docker Compose
- **Образы:** `oven/bun:1.2-alpine`, `postgres:16-alpine`
- **Конфигурация:** переменные среды через `.env` (не коммитятся)

## 4. Функциональные требования

### 4.1 Страницы

#### Главная страница `/`
- [ ] **Hero-секция:** имя/псевдоним, должность, город
- [ ] **Теги навыков:** список технологий в виде бейджей (Go, Bun, Hono, PostgreSQL, Docker)
- [ ] **CTA-кнопка:** плавный скролл к секции контакта
- [ ] **About-секция:** короткое описание разработчика (2–3 предложения)
- [ ] **Contact-секция:** форма обратной связи

### 4.2 Форма обратной связи
- [ ] Поля: `name` (string, min 1), `email` (valid email), `message` (string, min 5)
- [ ] Валидация на фронтенде (HTML5 required) и бэкенде (Zod)
- [ ] После успешной отправки — inline-сообщение "✅ Сообщение отправлено" без перезагрузки страницы
- [ ] Данные сохраняются в таблицу `contacts` в PostgreSQL

### 4.3 API

| Метод | Путь | Тело запроса | Ответ |
|---|---|---|---|
| GET | `/health` | — | `{ status: "ok" }` 200 |
| POST | `/api/contacts` | `{ name, email, message }` | Contact object 201 |
| GET | `/api/contacts` | — | Contact[] 200 |

### 4.4 База данных

Таблица `contacts`:
```sql
CREATE TABLE contacts (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 5. Нефункциональные требования

### 5.1 Качество кода
- [ ] TypeScript strict mode, `no any`
- [ ] ESLint без ошибок на фронтенде
- [ ] Нет хардкода секретов — только через `.env`
- [ ] Коммиты в формате Conventional Commits

### 5.2 Производительность
- [ ] Lighthouse Performance score ≥ 90
- [ ] Время ответа `/health` < 50ms
- [ ] Время ответа `POST /api/contacts` < 200ms

### 5.3 Docker
- [ ] `docker compose up --build -d` — все контейнеры запускаются без ошибок
- [ ] `db` имеет `healthcheck`, `backend` стартует только после `service_healthy`
- [ ] Multi-stage build для backend (финальный образ на `alpine`)
- [ ] Данные PostgreSQL персистентны через named volume `mytech_pgdata`

### 5.4 SEO и доступность
- [ ] `<title>MyTech</title>` и `<meta name="description">`
- [ ] Семантические HTML-теги (`<main>`, `<section>`, `<h1>`, `<h2>`)
- [ ] Alt-текст для всех изображений

## 6. Структура проекта

```
mytech/
├── .env                     # переменные среды (в .gitignore)
├── .env.example             # шаблон переменных
├── .gitignore
├── compose.yaml
├── README.md
├── TZ.md                    # данный файл
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/contact.ts
│   │   └── db/
│   │       ├── client.ts
│   │       └── schema.ts
│   ├── drizzle/migrations/
│   ├── drizzle.config.ts
│   ├── package.json
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── api.ts
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── Dockerfile
```

## 7. Переменные среды

| Переменная | Описание | Пример |
|---|---|---|
| `POSTGRES_USER` | Пользователь БД | `mytech_user` |
| `POSTGRES_PASSWORD` | Пароль БД | `secret` |
| `POSTGRES_DB` | Имя базы данных | `mytech_db` |
| `DATABASE_URL` | Полный DSN для Drizzle | `postgres://user:pass@db:5432/mytech_db` |

## 8. Чек-лист сдачи (Definition of Done)

### MVP
- [ ] `docker compose up --build -d` работает без ошибок
- [ ] Сайт открывается на `http://localhost:5173`
- [ ] Форма отправляет данные и сохраняет в PostgreSQL
- [ ] `GET /api/contacts` возвращает сохранённые записи
- [ ] `.env` не закоммичен, `.env.example` присутствует
- [ ] `README.md` с инструкцией запуска

### Full Release
- [ ] Lighthouse Performance ≥ 90
- [ ] TypeScript компилируется без ошибок (`tsc --noEmit`)
- [ ] ESLint без warnings
- [ ] Все API эндпоинты задокументированы в README
- [ ] Multi-stage Dockerfile сокращает размер образа
- [ ] Настроен `.dockerignore`

## 9. Этапы разработки

| Этап | Задача | Критерий завершения |
|---|---|---|
| 1 | Инициализация репозитория и структуры | Папки созданы, `git init` выполнен |
| 2 | Docker Compose + PostgreSQL | `docker compose up db -d` без ошибок |
| 3 | Drizzle schema + миграции | `bun run migrate` создаёт таблицу `contacts` |
| 4 | Hono API (CRUD contacts) | `POST /api/contacts` возвращает 201 |
| 5 | React UI (Hero + форма) | Форма отправляет данные на API |
| 6 | Tailwind стилизация | Сайт визуально завершён |
| 7 | Docker production build | `docker compose up --build` все сервисы Up |
| 8 | README + .env.example | Документация готова |
