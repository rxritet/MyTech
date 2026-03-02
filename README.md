# MyTech

> Personal developer portfolio site — site-vizitka.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript (Vite) |
| Backend | Bun + Hono |
| Database | PostgreSQL 16 |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| Containerization | Docker + Docker Compose |

## Project Structure

```
mytech/
├── .env                     # secrets (not committed)
├── .gitignore
├── compose.yaml
├── README.md
├── TZ.md
├── backend/
│   ├── src/
│   │   ├── index.ts         # Hono app entry
│   │   ├── routes/
│   │   │   └── contact.ts
│   │   └── db/
│   │       ├── client.ts    # Drizzle client
│   │       └── schema.ts    # DB schema
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
    ├── package.json
    └── Dockerfile
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) + Docker Compose
- [Bun](https://bun.sh/) >= 1.2 (for local dev)
- [pnpm](https://pnpm.io/) >= 9 (for frontend local dev)

### Run with Docker (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/rxritet/MyTech.git
cd MyTech

# 2. Create .env file
cp .env.example .env

# 3. Start all services
docker compose up --build -d

# 4. Check services
docker compose ps
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: localhost:5432

### Run Locally (without Docker)

```bash
# Start only the database
docker compose up db -d

# Backend
cd backend
bun install
bun run migrate
bun run dev      # :3000

# Frontend (new terminal)
cd frontend
pnpm install
pnpm dev         # :5173
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/contacts` | Submit contact form |
| GET | `/api/contacts` | List all contacts |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
POSTGRES_USER=mytech_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=mytech_db
DATABASE_URL=postgres://mytech_user:your_password@db:5432/mytech_db
```

## Conventional Commits

```
feat:     new feature
fix:      bug fix
refactor: code change without feature/fix
docs:     documentation only
chore:    build process or tooling
```

## License

MIT
