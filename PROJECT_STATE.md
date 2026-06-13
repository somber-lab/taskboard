# PROJECT_STATE

- **Project**: Taskboard
- **One-liner**: Personal task manager with Kanban boards, sortable list view, and metrics dashboard
- **Classification**: prototype (with a clear path to production)
- **Current phase**: 3 — Development
- **Phase status**: gate pending (all increments complete, README pending)

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

## Open questions / pending

- README.md update with run instructions

## Next step

All 9 MVP stories shipped. Phase 3 gate is pending README update.
After that: Phase 4 (TEST_PLAN.md + automated tests) or Phase 5 (deployment).
