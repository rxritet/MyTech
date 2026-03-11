<div align="center">

<h1>MyTech — Портфолио-сайт</h1>

<p>Персональный сайт-визитка разработчика, реализованный как полноценное<br/>full-stack приложение production-уровня.</p>

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bun](https://img.shields.io/badge/Bun-runtime-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/)
[![Hono](https://img.shields.io/badge/Hono-API-E36002?style=flat-square&logo=hono&logoColor=white)](https://hono.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-compose-2CA5E0?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## О проекте

**MyTech** — это не статичная страница с резюме. Это полноценное full-stack приложение: React-SPA на фронтенде, REST API на Bun + Hono, база данных PostgreSQL и Docker-оркестрация для деплоя. Весь стек упакован в контейнеры и поднимается одной командой.

Проект создан **Радмиром Абраевым** — студентом 2-го курса Software Engineering в AlmaU (Алматы) — как центральный элемент портфолио при поиске первой коммерческой роли в бэкенд- или full-stack-разработке.

> **Цель проекта:** показать не просто умение верстать, а инженерный подход — проектирование структуры, работу с данными, CI/CD-готовность и чистый код.

---

## Что демонстрирует проект

- **Full-stack мышление** — от компонентной архитектуры React до типобезопасных миграций Drizzle ORM
- **Production-ready настройка** — многоступенчатые Docker-сборки, Nginx как reverse-proxy, переменные окружения
- **Строгая типизация** — TypeScript strict mode на фронтенде и бэкенде без единого `any`
- **Чистая структура кода** — разделение на слои (pages / sections / hooks / api), читаемые компоненты
- **Реальная функциональность** — контактная форма с сохранением в БД, а не просто `mailto:`
- **UI/UX дизайн** — собственная дизайн-система «Deep Ink & Violet», анимации, адаптивная вёрстка

---

## Разделы сайта

| Раздел | Описание |
|---|---|
| **Hero** | Главный экран с анимациями, терминал-стайл отображение стека, ссылки на соцсети |
| **Обо мне** | Фото, биография, скачивание PDF-резюме, облако технологий, блок компетенций |
| **Проекты** | Карточки проектов с тегами стека и ссылками на исходный код / демо |
| **Контакты** | Рабочая форма обратной связи — данные сохраняются в PostgreSQL через REST API |

---

## Архитектура

```
MyTech/
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── sections/       # About, Hero, Contact, Projects, Services
│   │   ├── pages/              # Компоненты-страницы (роутинг)
│   │   ├── hooks/              # Кастомные хуки (useInView и др.)
│   │   ├── data/               # Статические данные (проекты, стек)
│   │   └── api.ts              # API-клиент (обёртка над fetch)
│   ├── Dockerfile              # Multi-stage build → nginx:alpine
│   └── nginx.conf              # SPA routing + gzip
│
├── backend/                    # Bun + Hono REST API
│   ├── src/                    # Хэндлеры маршрутов, схема БД, middleware
│   ├── drizzle/                # SQL-миграции
│   ├── drizzle.config.ts
│   └── Dockerfile              # oven/bun:alpine
│
└── compose.yml                 # Оркестрация: frontend + backend + postgres
```

**Поток данных:**
```
Браузер → Nginx (80) → React SPA
                    → /api/* → Hono (backend:3000) → PostgreSQL
```

---

## Технологический стек

### Фронтенд
- **React 18** + **TypeScript** (strict) — компонентный подход, полная типобезопасность
- **Tailwind CSS v4** — утилитарные стили, кастомные дизайн-токены
- **Vite** — мгновенный HMR в разработке, оптимизированный бандл в продакшене
- **React Router** — клиентский роутинг SPA
- **pnpm** — эффективное управление зависимостями

### Бэкенд
- **Bun** — высокопроизводительный JS-рантайм (быстрее Node.js в ~3×)
- **Hono** — минималистичный, типобезопасный REST-фреймворк
- **Drizzle ORM** — схема и миграции с полной типизацией
- **PostgreSQL 16** — основная база данных

### Инфраструктура
- **Docker** + **Docker Compose** — контейнеризация всего стека
- **Nginx** — раздача статики + проксирование API-запросов
- **Multi-stage builds** — минимальный размер итоговых образов

---

## Дизайн-система

Палитра **«Deep Ink & Violet»** — тёмная тема без переключателя:

| Токен | Hex | Применение |
|---|---|---|
| `primary` | `#7C3AED` | Кнопки, акценты, свечения, активные рамки |
| `background` | `#0F0A1A` | Основной фон страницы |
| `surface` | `#1A1127` | Карточки, навбар, теги (Bento-иерархия) |

Анимации: появление через `useInView` + Tailwind-переходы. Микровзаимодействия на кнопках (scale, shadow-glow).

---

## Запуск локально

> Требования: установленный **Docker** и **Docker Compose**.

```bash
# 1. Клонировать репозиторий
git clone https://github.com/rxritet/MyTech.git
cd MyTech

# 2. Настроить переменные окружения
cp .env.example .env

# 3. Собрать и запустить все сервисы
docker compose up -d --build
```

Открыть **[http://localhost:5173](http://localhost:5173)**.

### Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `POSTGRES_USER` | Пользователь БД | `postgres` |
| `POSTGRES_PASSWORD` | Пароль БД | `secret` |
| `POSTGRES_DB` | Имя базы данных | `mytech` |
| `DATABASE_URL` | Строка подключения | `postgres://user:pass@db:5432/mytech` |

Дефолтные значения из `.env.example` готовы для локальной разработки без изменений.

---

## API

Base URL: `http://localhost:3000`

| Метод | Эндпоинт | Описание | Тело запроса |
|---|---|---|---|
| `POST` | `/api/contacts` | Сохранить сообщение из контактной формы | `{ name, email, message }` |
| `GET` | `/api/contacts` | Список всех заявок (для администратора) | — |

---

## Скриншоты

> Дизайн страниц: Hero, Обо мне, Проекты, Контакты — тёмная тема, фиолетовые акценты.

---

## Автор

**Радмир Абраев** — Backend Developer · Студент Software Engineering (AlmaU, Алматы)

---

<div align="center">
<sub>Сделано с фокусом на детали, производительность и чистый код.</sub>
</div>
