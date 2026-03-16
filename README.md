<div align="center">

# MyTech

### Сайт-визитка, который работает как настоящий продукт

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=flat-square&logo=vercel&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?style=flat-square&logo=hono&logoColor=white)](https://hono.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

**MyTech** — персональный сайт-визитка Радмира Абраева. Не статичная HTML-страница, а живая платформа: контент редактируется через admin-интерфейс, форма обратной связи реально сохраняет сообщения, проекты живут в базе данных.

## Что видит посетитель

- **Главная** — личный бренд, стек, ключевые ссылки одним экраном
- **Проекты** — карточки с тегами технологий и отдельными страницами для каждого проекта
- **Обо мне** — биография, tech stack, области фокуса, образовательные репозитории
- **Условия работы** — формат сотрудничества и то, что берётся в работу
- **Контакт** — форма связи, которая уходит в backend и сохраняется в БД

## Что делает его не просто сайтом

Большинство portfolio-сайтов красивы, но пусты внутри. MyTech построен иначе.

- Контент проектов и раздела «Обо мне» хранится в PostgreSQL — без хардкода
- Есть admin-режим: редактирование биографии и управление проектами прямо из интерфейса
- Форма контакта не просто отправляет email — сообщения сохраняются в базе
- Весь стек поднимается локально одной командой (`docker compose up`)
- Готов к раздельному деплою: frontend на Vercel, backend — отдельным serverless API

## Admin-режим

Без единой правки кода можно:

- обновить раздел «Обо мне» — текст, стек, ссылки на репозитории
- создать, отредактировать или удалить проект в каталоге
- все мутации защищены через `x-admin-secret` header

## Стек

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7  
**Backend:** Node.js 20, Hono, Zod, Drizzle ORM  
**Data:** PostgreSQL 16  
**Infra:** Docker Compose, Nginx, Vercel-ready setup

## Быстрый старт

```bash
git clone https://github.com/rxritet/MyTech.git
cd MyTech
cp .env.example .env
docker compose up -d --build
```

После запуска сайт доступен на `http://localhost:5173`.

---

<div align="center">
  <sub>Built by <a href="https://github.com/rxritet">Радмир Абраев</a> · AlmaU · Backend / Full-stack Developer</sub>
</div>
