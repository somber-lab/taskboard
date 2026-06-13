# PROJECT_STATE

- **Project**: Taskboard
- **One-liner**: Personal task manager with Kanban boards, sortable list view, and metrics dashboard
- **Classification**: prototype (with a clear path to production)
- **Current phase**: 6 — Maintenance & Handoff
- **Phase status**: closed ✅
- **Released**: v1.0.0 — 2026-06-13

## Stack decisions

| Area | Choice | Reason |
|------|--------|--------|
| Frontend | Vite + React + TypeScript | SPA, no SSR needed, best DnD/table ecosystem |
| Styling | Tailwind CSS | Utility-first, full control, no design lock-in |
| Drag & drop | @dnd-kit | Purpose-built for Kanban, accessible |
| Sortable table | TanStack Table | Headless, handles sorting without opinionated markup |
| Charts | Recharts | Lightweight React charts |
| Backend | Hono + Node.js + TypeScript | Minimal, TS-native, no NestJS overhead |
| ORM | Drizzle | TypeScript-first schema, code-driven migrations |
| Database | PostgreSQL 16 | Relational, production-grade from day one |
| Runtime | Node.js 22 | LTS, native ESM |
| Containers | Docker + Nginx | Single-host self-hosted deployment |
| CI/CD | GitHub Actions → GHCR | Images tagged :latest + :sha-<commit> |

## Key decisions log

- 2026-06-13: Phase 0 closed — PRD approved, classification confirmed
- 2026-06-13: Classification = prototype, may scale — personal use, solo user
- 2026-06-13: Platform = web browser only
- 2026-06-13: No authentication required for v1 (single user)
- 2026-06-13: No hard deadline, no technology constraints
- 2026-06-13: Dashboard metrics confirmed: tasks by status, completions last 7/30d, unplanned, overdue
- 2026-06-13: Non-goals confirmed: no auth, no mobile, no notifications, no recurring tasks, no team features
- 2026-06-13: Backend required from day one — data persists server-side (drives Phase 2 stack)
- 2026-06-13: Phase 1 closed — 9 MVP stories approved, 4 post-MVP, 3 backlog
- 2026-06-13: Stack confirmed: Vite+React+TS / Hono / Drizzle / PostgreSQL
- 2026-06-13: ADR-002: PostgreSQL directly, no SQLite prototype step (user decision)
- 2026-06-13: ADR-005: is_done flag on columns for completion tracking (not name-matching)
- 2026-06-13: Deployment target: self-hosted Docker (user decision)
- 2026-06-13: CI/CD: GitHub Actions → GHCR (images pushed on merge to main)
- 2026-06-13: v1.0.0 released — all 9 MVP stories, 39 tests, full CI/CD pipeline

## Deliverables produced

- [x] PROJECT_STATE.md
- [x] docs/PRD.md + docs/PRD.es.md
- [x] docs/REQUIREMENTS.md + docs/REQUIREMENTS.es.md
- [x] docs/ARCHITECTURE.md + docs/ARCHITECTURE.es.md
- [x] docs/TEST_PLAN.md + docs/TEST_PLAN.es.md
- [x] docs/DEPLOYMENT.md + docs/DEPLOYMENT.es.md
- [x] docs/BACKLOG.md + docs/BACKLOG.es.md

## MVP User Stories — Status

| ID | Story | Status |
|----|-------|--------|
| US-01 | Sortable task list | ✅ Done (Inc-4) |
| US-02 | Create task | ✅ Done (Inc-2) |
| US-03 | Edit task | ✅ Done (Inc-5) |
| US-04 | Delete task | ✅ Done (Inc-5) |
| US-05 | Kanban board view | ✅ Done (Inc-3) |
| US-06 | Drag & drop between columns | ✅ Done (Inc-3) |
| US-07 | Create / list boards | ✅ Done (Inc-1) |
| US-08 | Configurable columns | ✅ Done (Inc-1) |
| US-09 | Metrics dashboard | ✅ Done (Inc-6) |

## Deployment

| Target | Platform | Notes |
|--------|----------|-------|
| Frontend | Docker (Nginx) | Vite build served via nginx, /api proxied to backend |
| Backend | Docker (Node 22) | tsup build, migrations on startup |
| Database | Docker (PostgreSQL 16) | Named volume for persistence |
| Orchestration | docker-compose.prod.yml | Single-host self-hosted |
| CI/CD | GitHub Actions → GHCR | test + build + push on merge to main |
| Images | ghcr.io/somber-lab/taskboard-* | Tagged :latest + :sha-<commit> |

## Monitoring

Skipped — prototype classification. If the project scales to production, add:
- Error tracking: Sentry (free tier)
- Uptime: UptimeRobot or Better Uptime (free tier)
- Dependency updates: enable GitHub Dependabot for npm

## Backlog

See [docs/BACKLOG.md](docs/BACKLOG.md). Top priority items:
1. US-10 Rename a board
2. US-11 Delete a board
3. US-12 Rename a column
4. US-13 Reorder columns

## Resuming this project

Read this file + BACKLOG.md. Classify the incoming request:
- **Bug** → mini Phase 4 cycle (fix → test → verify)
- **Small feature** → mini Phases 1→3→4 for that story
- **Big feature set** → fresh Phase 1 pass on the new scope

## Retrospective — 2026-06-13

**What worked well**: the whole process — phases, gates, autonomous execution without constant check-ins.

**What was painful**: nothing significant. Development went smoothly end to end.

**What was surprising**: how cleanly the development went. Code rarely works first time; this one did consistently.

**Note**: the user explicitly values autonomous execution (no questions between steps) and clean, structured phase discipline. Both were key to the positive experience.
