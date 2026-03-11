<div align="center">

<h1>MyTech — Portfolio Website</h1>

<p>Personal developer portfolio built as a full-stack production-ready application.<br/>
Designed to demonstrate engineering skills, project history, and technical depth.</p>

[![Live](https://img.shields.io/badge/Live-Demo-7C3AED?style=flat-square&logo=vercel&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-runtime-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh/)
[![Hono](https://img.shields.io/badge/Hono-API-E36002?style=flat-square&logo=hono&logoColor=white)](https://hono.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-compose-2CA5E0?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## About

**MyTech** is a personal portfolio and business card site for **Radmir Abraev** — a 2nd-year Software Engineering student at AlmaU (Almaty), focused on backend development (Go), full-stack projects (TypeScript/React), and mobile development (Flutter).

The project is not a static page. It is a complete full-stack application — with a REST API backend, PostgreSQL database, and Docker-based deployment — built to showcase real engineering practices.

> **Status:** Open to first commercial roles and interesting teams.

---

## Features

| Section | Description |
|---|---|
| **Hero** | Animated landing with terminal-style tech stack display and social links |
| **About** | Bio, photo, resume download (PDF), tech stack cloud, competency list |
| **Projects** | Cards with stack tags and links to source code / demo |
| **Contact** | Fully functional form — saves messages to PostgreSQL via REST API |

---

## Architecture

```
MyTech/
├── frontend/               # React + TypeScript SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── sections/   # About, Hero, Contact, Projects, Services
│   │   ├── pages/          # Route-level page components
│   │   ├── hooks/          # Custom hooks (useInView, etc.)
│   │   ├── data/           # Static data (projects, stack, etc.)
│   │   └── api.ts          # API client (fetch wrapper)
│   ├── Dockerfile          # Multi-stage build → nginx:alpine
│   └── nginx.conf
│
├── backend/                # Bun + Hono REST API
│   ├── src/                # Route handlers, DB schema, middleware
│   ├── drizzle/            # SQL migrations
│   ├── drizzle.config.ts
│   └── Dockerfile          # oven/bun:alpine
│
└── compose.yml             # Orchestration: frontend + backend + postgres
```

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** (strict mode) — component-driven UI with full type safety
- **Tailwind CSS v4** — utility-first styling, custom design tokens (`#7C3AED` / `#0F0A1A` / `#1A1127`)
- **Vite** — fast HMR in development, optimized bundle for production
- **pnpm** — efficient dependency management

### Backend
- **Bun** — high-performance JS runtime
- **Hono** — lightweight, type-safe REST framework
- **Drizzle ORM** + **PostgreSQL 16** — type-safe migrations and queries

### Infrastructure
- **Docker** + **Docker Compose** — containerized full-stack environment
- **Nginx** — static file serving with SPA routing support

---

## Design System

The site uses a strictly defined **"Deep Ink & Violet"** palette — no light theme.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#7C3AED` | Buttons, accents, glow effects, borders |
| `background` | `#0F0A1A` | Main page background |
| `surface` | `#1A1127` | Cards, nav, tags (Bento-style hierarchy) |

---

## Getting Started

> Prerequisites: **Docker** and **Docker Compose** installed.

```bash
# 1. Clone the repository
git clone https://github.com/rxritet/MyTech.git
cd MyTech

# 2. Configure environment variables
cp .env.example .env

# 3. Build and start all services
docker compose up -d --build
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `POSTGRES_USER` | DB username | `postgres` |
| `POSTGRES_PASSWORD` | DB password | `secret` |
| `POSTGRES_DB` | Database name | `mytech` |
| `DATABASE_URL` | Full connection string | `postgres://...` |

See `.env.example` for defaults ready for local development.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contacts` | Submit a contact form message |
| `GET` | `/api/contacts` | List all contact submissions (admin) |

---

## Author

**Radmir Abraev** — Backend Developer · Software Engineering Student

[![GitHub](https://img.shields.io/badge/GitHub-rxritet-181717?style=flat-square&logo=github)](https://github.com/rxritet)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Radmir_Abraev-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/radmir-abraev-186b393b0/)
[![Telegram](https://img.shields.io/badge/Telegram-rxritet-26A5E4?style=flat-square&logo=telegram)](https://t.me/rxritet)
[![Email](https://img.shields.io/badge/Email-abraevradmir2@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:abraevradmir2@gmail.com)

---

<div align="center">
<sub>Built with focus on detail, performance, and clean code.</sub>
</div>
