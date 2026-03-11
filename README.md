<div align="center">

# MyTech

### Full-stack portfolio platform, not just a resume page

<p>
  Персональный сайт-портфолио, собранный как полноценное production-ready приложение:
  с собственным API, базой данных, админским режимом, Docker-инфраструктурой
  и подготовкой к деплою на Vercel.
</p>

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?style=flat-square&logo=hono&logoColor=white)](https://hono.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## Что Это За Проект

**MyTech** — это личная full-stack платформа Радмира Абраева, в которой портфолио подано как реальный цифровой продукт, а не как статичная landing-page визитка.

Проект решает сразу несколько задач:

- показывает проекты, стек, опыт и рабочий подход в одном цельном интерфейсе
- демонстрирует инженерное мышление через API, базу данных, типизацию и контейнеризацию
- даёт управляемую структуру контента через admin-режим, а не через ручное редактирование кода
- служит готовой базой для деплоя, расширения и дальнейшего развития

Идея проекта в том, чтобы работодатель или заказчик видел не только визуальный результат, но и то, **как именно** устроен продукт под капотом.

---

## Зачем Он Нужен

У обычного портфолио есть слабое место: оно почти ничего не говорит о качестве архитектуры, работе с данными, сопровождении и зрелости разработки. MyTech закрывает этот разрыв.

Здесь портфолио становится демонстрацией:

- полноценного frontend-приложения на современном React-стеке
- backend API с типобезопасной валидацией и CRUD-операциями
- хранения и редактирования контента через базу данных
- готовности к локальной сборке, контейнеризации и облачному деплою

---

## Что Умеет Проект

### Пользовательская часть

- главная страница с акцентом на личный бренд, стек и навигацию
- страница “Обо мне” с биографией, технологиями, фокусом, компетенциями и образовательными репозиториями
- страница проектов с карточками, тегами технологий и детальными страницами каждого проекта
- страница условий работы с описанием формата сотрудничества
- страница контактов с рабочей формой отправки сообщений

### Админский режим

- редактирование контента блока “Обо мне” без правки исходников
- структурное редактирование проектов внутри About, включая GitHub URL
- создание, обновление и удаление карточек проектов
- защита админских операций через `x-admin-secret`

### Инженерная часть

- единый API-клиент на фронтенде
- строгая типизация frontend и backend слоёв
- контейнеризация всего стека через Docker Compose
- подготовка к Vercel для фронтенда и backend serverless entrypoint

---

## Сильные Стороны

- **Это не шаблонный portfolio clone.** В проекте есть реальные сущности, API, база данных и админские сценарии.
- **Чистое разделение ответственности.** UI, pages, sections, hooks, API и backend routes разнесены по понятным слоям.
- **Хорошая расширяемость.** Можно добавлять новые сущности, страницы, админские возможности и аналитику без переписывания основы.
- **Деплой-готовность.** Проект запускается локально в контейнерах и уже адаптирован под Vercel-архитектуру.
- **Сильная визуальная консистентность.** Общие токены, панели, контейнеры, кнопки и технологические бейджи работают как единая дизайн-система.

---

## Как Это Работает

### Общий поток

```text
Пользователь открывает сайт
    ↓
Nginx отдаёт frontend-сборку
    ↓
React SPA рендерит страницы и делает запросы в /api
    ↓
Hono backend обрабатывает маршруты
    ↓
Drizzle ORM работает с PostgreSQL
    ↓
Контент, проекты и сообщения сохраняются в базе данных
```

### Поведение по слоям

- **Frontend** отвечает за роутинг, отображение страниц, формы, анимации и admin-модалки
- **API client** инкапсулирует работу с запросами и типами данных
- **Backend** валидирует входные payload'ы, выполняет CRUD и нормализует данные
- **Database** хранит заявки из формы контактов, about-контент и проекты

---

## Архитектура Проекта

```text
MyTech/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/        # admin-модалки и формы
│   │   │   ├── layout/       # Navbar, Footer, ScrollToTop
│   │   │   ├── sections/     # Hero, About, Projects, Contact, Services
│   │   │   └── ui/           # ProjectCard, SkillBadge, ServiceCard и др.
│   │   ├── context/          # admin-state
│   │   ├── data/             # статические данные и цветовые карты
│   │   ├── hooks/            # useProjects, useInView, useScrollProgress и др.
│   │   ├── pages/            # route-level страницы
│   │   ├── api.ts            # общий API client + shared types
│   │   └── index.css         # глобальные токены и визуальная система
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vercel.json
│
├── backend/
│   ├── api/                  # Vercel handler
│   ├── drizzle/              # SQL migrations
│   ├── src/
│   │   ├── db/               # client, schema, migrate
│   │   ├── middleware/       # adminAuth
│   │   ├── routes/           # about, contact, projects
│   │   ├── app.ts            # shared Hono app
│   │   └── index.ts          # Node server entrypoint
│   ├── Dockerfile
│   └── drizzle.config.ts
│
├── compose.yml
└── README.md
```

---

## Технологии

### Frontend

- **React 19** — современный UI-слой и компонентная архитектура
- **React Router 7** — маршрутизация по страницам
- **TypeScript** — строгая типизация без размытых контрактов
- **Vite 6** — быстрая разработка и production build
- **Tailwind CSS 4** — утилитарная стилизация и кастомные design tokens
- **Lucide React** — иконки интерфейса

### Backend

- **Node.js 20** — runtime для локального запуска, Docker и Vercel
- **Hono** — лёгкий и быстрый HTTP-framework
- **Zod** — валидация входящих данных
- **Drizzle ORM** — typed schema и работа с PostgreSQL
- **postgres** — драйвер для подключения к БД
- **dotenv** — конфигурация окружения

### Infrastructure

- **PostgreSQL 16** — основное хранилище данных
- **Docker + Docker Compose** — локальный orchestration всего стека
- **Nginx** — отдача frontend-сборки
- **Vercel-ready setup** — отдельные точки входа для frontend и backend

---

## Почему Технически Проект Выглядит Сильно

- API и frontend используют общие, понятные контракты данных
- проект не завязан на моках: формы и контент реально ходят в backend
- есть отдельный middleware для admin-защиты
- backend умеет работать с legacy-данными и нормализует About payload
- frontend использует единый цветовой словарь технологий, а не хаотичный набор классов
- роутинг доведён до UX-деталей, включая возврат наверх при переходах

---

## Локальный Запуск

### Через Docker

```bash
git clone https://github.com/rxritet/MyTech.git
cd MyTech
cp .env.example .env
docker compose up -d --build
```

После запуска:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3000`
- database: `localhost:5432`

### Что поднимется

- `mytech_frontend`
- `mytech_backend`
- `mytech_db`

---

## Переменные Окружения

### Корень проекта

| Переменная | Назначение | Пример |
|---|---|---|
| `POSTGRES_USER` | пользователь PostgreSQL | `mytech_user` |
| `POSTGRES_PASSWORD` | пароль PostgreSQL | `your_password_here` |
| `POSTGRES_DB` | имя базы данных | `mytech_db` |
| `DATABASE_URL` | строка подключения для backend | `postgres://mytech_user:password@db:5432/mytech_db` |
| `ADMIN_SECRET` | секрет для защищённых admin-запросов | `change_me` |

### Frontend

| Переменная | Назначение | Пример |
|---|---|---|
| `VITE_API_URL` | адрес backend API | `http://localhost:3000` |

---

## Основные API Маршруты

Base URL локально: `http://localhost:3000`

### Contacts

- `POST /api/contacts` — отправить сообщение из формы
- `GET /api/contacts` — получить список сообщений

### About

- `GET /api/about` — получить контент страницы “Обо мне”
- `PATCH /api/about` — обновить контент About через admin-secret

### Projects

- `GET /api/projects` — получить список проектов
- `GET /api/projects/:slug` — получить один проект
- `POST /api/projects` — создать проект
- `PUT /api/projects/:id` — обновить проект
- `DELETE /api/projects/:id` — удалить проект

---

## Деплой

Проект подготовлен к раздельному деплою frontend и backend.

### Frontend

- деплоится как отдельный Vercel project с root directory `frontend`
- использует `vercel.json` для SPA rewrites
- получает `VITE_API_URL` через environment variables

### Backend

- деплоится как отдельный Vercel project с root directory `backend`
- использует serverless handler в `backend/api/[[...route]].ts`
- требует `DATABASE_URL` и `ADMIN_SECRET`

---

## Для Кого Этот Проект

MyTech особенно хорошо показывает себя в двух сценариях:

- **для работодателя** — как доказательство full-stack подхода, не только UI-навыков
- **для заказчика** — как пример аккуратного продукта с ясной архитектурой и продуманной подачей

---

## Автор

**Радмир Абраев**

- Backend / Full-stack Developer
- Software Engineering student at AlmaU
- GitHub: `rxritet`

---

<div align="center">
  <sub>MyTech показывает не только то, что сделано, но и то, как именно это сделано.</sub>
</div>
