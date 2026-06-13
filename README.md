# Taskboard

Personal task manager with Kanban boards, sortable list view, and a metrics dashboard.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + TypeScript + Tailwind CSS |
| Backend | Hono + Node.js + TypeScript |
| ORM | Drizzle |
| Database | PostgreSQL |

## Project docs

| Document | Description |
|----------|-------------|
| [docs/PRD.md](docs/PRD.md) | Product requirements |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | User stories and acceptance criteria |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack decisions, data model, API contract, ADRs |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | Test strategy and coverage map |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guide and rollback procedure |

---

## Development

### Prerequisites

- Node.js 22+
- Docker + Docker Compose
- npm

### 1. Start the database

```bash
docker compose up -d       # starts PostgreSQL on localhost:5432
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # pre-configured for local Docker — no changes needed
npm install
npm run db:generate        # generate Drizzle migrations
npm run db:migrate         # apply migrations
npm run dev                # http://localhost:3000
```

> Seeds a default board ("My Board") with 4 columns on first start.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173).

### Tests

```bash
cd backend  && npm test    # 22 tests
cd frontend && npm test    # 17 tests
```

---

## Production

Images are built and pushed to GHCR automatically on every merge to `main`:

```
ghcr.io/somber-lab/taskboard-backend:latest
ghcr.io/somber-lab/taskboard-frontend:latest
```

### First deploy

```bash
cp .env.prod.example .env.prod
# edit .env.prod — set POSTGRES_PASSWORD and ALLOWED_ORIGIN

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Update to latest version

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

No rebuild needed — the CI pipeline already built the images.

### Rollback to a specific version

```bash
# List available image tags (each push to main gets a :sha-<commit> tag)
# Replace :latest with :sha-<commit> in .env.prod or run directly:
docker compose -f docker-compose.prod.yml --env-file .env.prod \
  up -d --no-build \
  --image ghcr.io/somber-lab/taskboard-backend:sha-abc1234 \
  --image ghcr.io/somber-lab/taskboard-frontend:sha-abc1234
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full guide.

---

## Available routes

| Path | View |
|------|------|
| `/` | Sortable list of all tasks |
| `/boards` | Board list — create and navigate boards |
| `/boards/:id` | Kanban board with drag & drop |
| `/dashboard` | Metrics: tasks by status, completions, overdue |
