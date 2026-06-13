# Taskboard — Deployment

## Environments & URLs

| Environment | URL | Notes |
|-------------|-----|-------|
| Development | http://localhost:5173 | Vite dev server + Docker postgres |
| Production  | http://your-server-ip-or-domain | Docker Compose stack |

## Architecture

```
                ┌─────────────────────────────────┐
                │   Docker host (VPS / local)      │
                │                                  │
  Browser ─────►│  frontend:80  (nginx)            │
                │     │  serves SPA                │
                │     │  proxies /api/*            │
                │     ▼                            │
                │  backend:3000 (Hono/Node)        │
                │     │  REST API                  │
                │     │  runs migrations on start  │
                │     ▼                            │
                │  db:5432  (PostgreSQL 16)        │
                └─────────────────────────────────┘
```

## Hosting setup

Three Docker services in `docker-compose.prod.yml`:

| Service | Image | Role |
|---------|-------|------|
| `db` | postgres:16-alpine | Persistent data store |
| `backend` | built from `./backend` | Hono API + migrations |
| `frontend` | built from `./frontend` | Nginx serving the React build + /api proxy |

## Environment variables

Create a `.env.prod` file on the host (never commit it):

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `POSTGRES_PASSWORD` | ✅ | — | PostgreSQL password |
| `POSTGRES_USER` | — | `taskboard` | PostgreSQL user |
| `POSTGRES_DB` | — | `taskboard` | PostgreSQL database name |
| `ALLOWED_ORIGIN` | ✅ | — | CORS origin (e.g. `http://192.168.1.100`) |
| `PORT` | — | `80` | Host port for the frontend |

Copy `.env.prod.example` and fill in the values:
```bash
cp .env.prod.example .env.prod
# edit .env.prod with a real password and your server's address
```

## CI/CD pipeline

`.github/workflows/ci.yml` runs on every push and pull request to `main`:

```
push / PR to main
  ├── test-backend    npm ci → npm test  (22 tests)
  ├── test-frontend   npm ci → npm test  (17 tests)
  └── build-images    (after tests pass)
        ├── docker build ./backend
        └── docker build ./frontend
```

Deploy to production is **manual** — the pipeline verifies correctness, you trigger the deploy.

## How to deploy

### First-time setup on the host

```bash
# 1. Install Docker + Docker Compose
#    https://docs.docker.com/engine/install/

# 2. Clone the repo
git clone https://github.com/somber-lab/taskboard.git
cd taskboard

# 3. Create the production env file
cp .env.prod.example .env.prod
nano .env.prod          # set POSTGRES_PASSWORD and ALLOWED_ORIGIN

# 4. Build and start the stack
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 5. Verify all containers are running
docker compose -f docker-compose.prod.yml ps
```

The backend runs `drizzle-kit migrate` and the seed on startup — no manual DB setup needed.

### Updating to a new version

```bash
git pull origin main
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

Docker Compose will rebuild only the changed services.

## How to roll back

### Option A — revert to previous image (fast, no rebuild)

```bash
# Find the image ID before the last build
docker images taskboard-backend
docker images taskboard-frontend

# Stop current containers and run the previous image manually
# (only viable if you tagged the previous image before rebuilding)
```

### Option B — revert the code and rebuild (recommended)

```bash
# Find the last known-good commit
git log --oneline -10

# Revert to that commit
git checkout <commit-hash>

# Rebuild and redeploy
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

### Option C — tag images before deploying (best practice)

Before each deploy, tag the current image so rollback is instant:

```bash
docker tag taskboard-backend taskboard-backend:prev
docker tag taskboard-frontend taskboard-frontend:prev

# To roll back:
docker compose -f docker-compose.prod.yml down
docker tag taskboard-backend:prev taskboard-backend:latest
docker tag taskboard-frontend:prev taskboard-frontend:latest
docker compose -f docker-compose.prod.yml up -d
```

## Database backups

```bash
# Manual backup
docker exec taskboard-db-1 pg_dump -U taskboard taskboard > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20260613.sql | docker exec -i taskboard-db-1 psql -U taskboard taskboard
```

## First-time setup from scratch (disaster recovery)

1. Provision a host with Docker + Docker Compose installed.
2. Clone the repo and create `.env.prod` with the correct values.
3. Run `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build`.
4. Restore the latest database backup (see above).
5. Verify at `http://your-server-ip` — the app should load with all data.

Total recovery time: ~10 minutes + backup restore time.
