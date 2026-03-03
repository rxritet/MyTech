# MyTech

> Персональный **full‑stack сайт‑визитка** разработчика: современный лендинг с секциями Projects / About / Services / Contact, анимированным скроллом и формой обратной связи на Bun + Hono + PostgreSQL.

![Status](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/UI-React%20%2B%20Vite-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=fff)
![Bun](https://img.shields.io/badge/Runtime-Bun-black?logo=bun)
![Hono](https://img.shields.io/badge/API-Hono-orange)
![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL%2016-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## 📌 О проекте

**MyTech** — это одностраничный сайт‑портфолио, вдохновлённый современными лендингами вроде _FullStackForge_.

Он показывает:

- как собрать **production‑ready full‑stack проект** на TypeScript;
- как сделать **чистый UI** с секциями и плавной навигацией;
- как связать **React → Bun/Hono API → PostgreSQL** и упаковать всё в Docker.

Основной сценарий: посетитель знакомится с тобой как с разработчиком, смотрит проекты и может сразу написать через форму, а данные улетают в backend и сохраняются в базе.

---

## ✨ Ключевые фичи интерфейса

- **Фиксированный Navbar** с активным пунктом по текущей секции (hero / projects / about / services / contact).
- **Полоса прогресса скролла** вверху страницы, которая растёт по мере прокрутки.
- **Hero‑секция** с gradient‑именем, тегами скиллов и CTA‑кнопками.
- **Projects‑секция** с карточками проектов: название, стек, описание, ссылки на GitHub / demo.
- **About‑секция** с краткой историей и блоком ключевых навыков.
- **Services / Условия работы** — карточки того, что ты предлагаешь как разработчик.
- **Contact‑форма**: имя + e‑mail + сообщение → POST `/api/contacts` + inline‑обратная связь.
- **Анимации при скролле** (fade‑in снизу) без сторонних библиотек, только CSS + Intersection Observer.
- **Адаптивность**: корректный вид на мобильных, планшетах и десктопе.

---

## 🛠️ Стек технологий

| Слой | Технологии |
|---|---|
| Фронтенд | React + TypeScript + Vite + Tailwind CSS |
| Бэкенд | Bun + Hono (REST API) |
| БД и ORM | PostgreSQL 16 + Drizzle ORM |
| Инфраструктура | Docker + Docker Compose |
| Статический хостинг (prod) | nginx (SPA + reverse proxy) |

---

## 🧱 Архитектура и структура

Общая схема:

```text
Browser
 └── React SPA (Vite, :5173)
      └── Hono API (Bun, :3000)
           └── PostgreSQL (contacts table)
```

Структура репозитория (упрощённо):

```text
MyTech/
├── compose.yml            # Docker Compose (db, backend, frontend)
├── .env.example           # Шаблон переменных среды
├── TZ.md                  # Техническое задание и критерии готовности
│
├── backend/
│   ├── src/
│   │   ├── index.ts       # Точка входа Hono‑сервера
│   │   ├── routes/
│   │   │   └── contact.ts # REST‑роуты /api/contacts
│   │   └── db/
│   │       ├── client.ts  # Drizzle + postgres‑js клиент
│   │       └── schema.ts  # Схема таблицы contacts
│   ├── drizzle/
│   │   └── migrations/    # SQL‑миграции
│   ├── drizzle.config.ts
│   └── Dockerfile
│
└── frontend/
    ├── src/
    │   ├── App.tsx        # Компоновка секций + подключение хуков
    │   ├── api.ts         # HTTP‑клиент для backend API
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.tsx
    │   │   │   └── Footer.tsx
    │   │   ├── sections/
    │   │   │   ├── Hero.tsx
    │   │   │   ├── Projects.tsx
    │   │   │   ├── About.tsx
    │   │   │   ├── Services.tsx
    │   │   │   └── Contact.tsx
    │   │   └── ui/        # Карточки, бейджи, иконки и т.п.
    │   ├── hooks/
    │   │   ├── useScrollProgress.ts  # Прогресс‑бар скролла
    │   │   └── useActiveSection.ts   # Определение активной секции
    │   └── index.css      # Tailwind + кастомные анимации
    ├── index.html
    ├── vite.config.ts
    └── Dockerfile
```

---

## 🚀 Быстрый старт (Docker)

**Требования:** установлен Docker Desktop или Docker Engine + Compose plugin.

```bash
# 1. Клонировать репозиторий
git clone https://github.com/rxritet/MyTech.git
cd MyTech

# 2. Создать .env из шаблона
cp .env.example .env
# при необходимости отредактируй значения (user/password/db)

# 3. Собрать и запустить все сервисы
docker compose up --build -d

# 4. Открыть сайт
#    http://localhost:5173
```

Остановка и очистка:

```bash
# Остановить контейнеры
docker compose down

# Остановить и удалить volume с данными БД
docker compose down -v
```

Сервисы по портам:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432 (контейнер `db`)

---

## 🔐 Переменные среды

Файл `.env` (**не коммитится**, см. `.gitignore`):

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `POSTGRES_USER` | `mytech_user` | Пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | `your_password_here` | Пароль PostgreSQL |
| `POSTGRES_DB` | `mytech_db` | Имя базы данных |
| `DATABASE_URL` | `postgres://mytech_user:your_password_here@db:5432/mytech_db` | DSN для Drizzle/бэкенда |

> Совет: для локальной разработки можно использовать те же значения, что и в `.env.example`.

---

## 📡 API

Базовый URL для backend: `http://localhost:3000`.

### `GET /health`

Проверка работоспособности сервера.

```bash
curl http://localhost:3000/health
```

**Ответ 200:**

```json
{ "status": "ok" }
```

---

### `POST /api/contacts`

Создать запись из формы обратной связи.

**Тело запроса:**

```json
{
  "name": "Иван",
  "email": "ivan@example.com",
  "message": "Привет! Хочу обсудить проект."
}
```

| Поле | Тип | Ограничения |
|---|---|---|
| `name` | string | 1–100 символов, обязательно |
| `email` | string | валидный e‑mail, обязательно |
| `message` | string | 5–2000 символов, обязательно |

**Успешный ответ 201:**

```json
{
  "id": 1,
  "name": "Иван",
  "email": "ivan@example.com",
  "message": "Привет! Хочу обсудить проект.",
  "createdAt": "2026-03-03T12:00:00.000Z"
}
```

---

### `GET /api/contacts`

Список всех отправленных сообщений (для отладки / админки).

```bash
curl http://localhost:3000/api/contacts
```

**Ответ 200:** массив объектов, аналогичных примеру выше.

---

## 💻 Локальная разработка (без Docker)

**Нужно:** Bun ≥ 1.2, Node.js ≥ 22, pnpm, локальный PostgreSQL.

### Backend

```bash
cd backend
bun install

# убедись, что DATABASE_URL в .env указывает на локальную БД
bun run migrate   # применить миграции
bun run dev       # dev‑сервер на :3000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev          # Vite dev‑сервер на :5173
```

Фронтенд в dev‑режиме обычно проксирует запросы `/api/*` на backend.

---

## 📋 Скрипты

### backend/

| Команда | Описание |
|---|---|
| `bun run dev` | Dev‑сервер с hot reload |
| `bun run start` | Production‑запуск сервера |
| `bun run migrate` | Применить миграции Drizzle |
| `bun run generate` | Сгенерировать миграции из схемы |

### frontend/

| Команда | Описание |
|---|---|
| `pnpm dev` | Vite dev‑сервер |
| `pnpm build` | Production‑сборка в `dist/` |
| `pnpm preview` | Предпросмотр production‑сборки |
| `pnpm lint` | ESLint‑проверка |
| `pnpm typecheck` | Проверка типов (`tsc --noEmit`) |

---

## 🧭 Roadmap (что ещё можно добавить)

- [ ] Тёмная/светлая тема (theme toggle).
- [ ] Фильтрация проектов по стеку.
- [ ] Счётчики заявок и простая админка.
- [ ] Деплой на Vercel/Render/Fly.io.
- [ ] GitHub Actions pipeline: lint + typecheck + docker build.

---

## 🧾 Соглашения о коммитах

Используется формат [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/):

| Префикс | Назначение |
|---|---|
| `feat:` | Новая функциональность |
| `fix:` | Исправление ошибок |
| `docs:` | Документация и README |
| `refactor:` | Рефакторинг без изменения поведения |
| `chore:` | Обновление зависимостей, мелкие задачи |
| `infra:` | Docker, CI/CD, инфраструктура |

---

## 📜 Лицензия

MIT — используй, форкай и дорабатывай под свои задачи.
