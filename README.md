# MyTech

MyTech — персональная full-stack платформа (портфолио + админ-панель) с хранением контента в базе данных.

## Технологии

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7
- Backend: Node.js 20, Hono, Zod, Drizzle ORM
- База данных: PostgreSQL 16
- Инфраструктура: Docker Compose, Nginx

## Возможности

### Публичная часть

- Главная страница
- Каталог проектов
- Детальная страница проекта (галерея, этапы разработки, стек)
- Страница «Обо мне»
- Страница «Работа» (таймлайн мест работы)
- Контактная форма с сохранением в БД

### Админ-панель

- CRUD проектов
- CRUD технологий
- Управление стеком для Home/About
- Редактирование контента About
- CRUD мест работы

### Поддержка иконок технологий

- Devicon slug
- Devicon class (`devicon-*`)
- URL изображения
- Inline SVG
- Сжатие SVG
- Перекраска SVG в белый

## API (основные маршруты)

- `/api/about`
- `/api/contacts`
- `/api/projects`
- `/api/technologies`
- `/api/stack/home`
- `/api/stack/about`
- `/api/work-experience`

Для защищённых операций используется заголовок `x-admin-secret`.

## Условия запуска

### Требования

- Docker
- Docker Compose

### Быстрый старт

```bash
git clone https://github.com/rxritet/MyTech.git
cd MyTech
cp .env.example .env
docker compose up -d --build
```

После запуска:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Переменные окружения

Используйте шаблон из `.env.example` (в корне репозитория).

Минимально нужны:

- параметры PostgreSQL
- `DATABASE_URL`
- `ADMIN_SECRET`

## Команды разработки

### Frontend

```bash
cd frontend
npm run dev
npm run typecheck
npm run build
```

### Backend

```bash
cd backend
npm run dev
npm run typecheck
npm run migrate
```

## Автор

Radmir Abraev

- GitHub: https://github.com/rxritet
- Telegram: https://t.me/rxritet
- LinkedIn: https://www.linkedin.com/in/radmir-abraev-186b393b0/
