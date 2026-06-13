# PROJECT_STATE

- **Project**: Taskboard
- **One-liner**: Personal task manager with Kanban boards, sortable list view, and metrics dashboard
- **Classification**: prototype (with a clear path to production)
- **Current phase**: 2 — Design & Architecture
- **Phase status**: gate pending

## Stack decisions

| Area | Choice | Reason |
|------|--------|--------|
| Frontend | Vite + React + TypeScript | SPA, no SSR needed, best DnD/table ecosystem |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, full control, no design lock-in |
| Drag & drop | @dnd-kit | Purpose-built for Kanban, accessible |
| Sortable table | TanStack Table | Headless, handles sorting without opinionated markup |
| Charts | Recharts | Lightweight React charts |
| Backend | Hono + Node.js + TypeScript | Minimal, TS-native, no NestJS overhead |
| ORM | Drizzle | TypeScript-first schema, code-driven migrations |
| Database | PostgreSQL | Relational, production-grade from day one |

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

## Deliverables produced

- [x] PROJECT_STATE.md
- [x] docs/PRD.md
- [x] docs/PRD.es.md
- [x] docs/REQUIREMENTS.md
- [x] docs/REQUIREMENTS.es.md
- [x] docs/ARCHITECTURE.md
- [x] docs/ARCHITECTURE.es.md
- [ ] docs/TEST_PLAN.md
- [ ] docs/DEPLOYMENT.md

## Open questions / pending

- Stack selection (Phase 2)

## Next step

Enter Phase 3: Development.
Scaffold the repo structure (frontend/ + backend/), install dependencies,
wire up the Hono server, Drizzle schema, and Vite frontend.
Build in US order: US-07 (boards) → US-08 (columns) → US-02 (create task) → US-05 (board view)
→ US-06 (DnD) → US-01 (list) → US-03/04 (edit/delete) → US-09 (dashboard).
