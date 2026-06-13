# Taskboard

Personal task manager with Kanban boards, sortable list view, and a metrics dashboard.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + TypeScript + Tailwind CSS + shadcn/ui |
| Backend | Hono + Node.js + TypeScript |
| ORM | Drizzle |
| Database | PostgreSQL |

## Project docs

| Document | Description |
|----------|-------------|
| [docs/PRD.md](docs/PRD.md) | Product requirements |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | User stories and acceptance criteria |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack decisions, data model, API contract, ADRs |

## Prerequisites

- Node.js 20+
- Docker + Docker Compose (for PostgreSQL)
- npm

## Getting started

### 1. Start the database

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # pre-configured for local Docker — no changes needed
npm install
npm run db:generate    # generate Drizzle migrations
npm run db:migrate     # apply migrations
npm run dev            # starts on http://localhost:3000
```

> The backend seeds a default board ("My Board") with 4 columns on first start.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available routes

| Path | View |
|------|------|
| `/` | Sortable list of all tasks |
| `/boards` | Board list — create and navigate boards |
| `/boards/:id` | Kanban board with drag & drop |
| `/dashboard` | Metrics: tasks by status, completions, overdue |

## API base URL

`http://localhost:3000/api` — proxied through Vite dev server as `/api`.

## Status

Phase 3 complete — all 9 MVP user stories shipped.
