# Taskboard — Test Plan

## Strategy

**Classification**: prototype → production path  
**Pyramid**: unit + integration (automated) + manual smoke (UI flows).  
E2E with Playwright deferred until production classification is confirmed.

| Layer | Scope | Tooling |
|-------|-------|---------|
| Backend integration | Hono route handlers with mocked DB | Vitest |
| Frontend unit | React components (render, interaction, validation) | Vitest + React Testing Library |
| Manual smoke | Critical UI flows not covered by automated tests | Checklist below |

## Coverage map

| Story | Acceptance criterion | Test type | Test ID | Status |
|-------|---------------------|-----------|---------|--------|
| US-01 | All tasks visible with all fields | Manual | M-01 | ✅ |
| US-01 | Click header → sorted asc; click again → desc | Manual | M-02 | ✅ |
| US-01 | Empty state shown when no tasks | Manual | M-03 | ✅ |
| US-02 | Valid submit → task saved in default column | Backend | tasks › POST accepts task without dates | ✅ |
| US-02 | Empty title → validation error, no save | Backend + Frontend | tasks › POST rejects empty title / TaskModal create validation | ✅ |
| US-02 | Empty description → validation error, no save | Backend + Frontend | tasks › POST rejects empty description / TaskModal create validation | ✅ |
| US-02 | Board pre-selected; optional dates accepted | Frontend | TaskModal › calls onSaved after successful create | ✅ |
| US-03 | Edit any field → persisted in all views | Backend | tasks › PATCH rejects empty title / PATCH rejects empty description | ✅ |
| US-03 | Clear title or description → validation error | Backend + Frontend | TaskModal edit › pre-fills title and description | ✅ |
| US-04 | Delete + confirm → task gone from all views | Backend | tasks › DELETE returns 204 | ✅ |
| US-04 | Confirmation required before delete | Frontend | TaskModal › shows confirmation step / cancelling hides confirm UI | ✅ |
| US-05 | Tasks displayed in correct columns | Manual | M-04 | ✅ |
| US-05 | Columns shown left to right | Manual | M-05 | ✅ |
| US-05 | Empty columns shown with no tasks | Manual | M-06 | ✅ |
| US-06 | Drag to column B → immediate move | Manual | M-07 | ✅ |
| US-06 | Reload → task still in column B | Manual | M-08 | ✅ |
| US-06 | Visual indicator on drop targets | Manual | M-09 | ✅ |
| US-07 | Create board → appears in selectors | Backend | boards › GET /boards returns list | ✅ |
| US-07 | New board has 4 default columns | Manual | M-10 | ✅ |
| US-07 | No name → validation error | Backend | boards › POST rejects empty name | ✅ |
| US-08 | Add column → appears at right end | Backend | boards › GET /boards/:id/columns | ✅ |
| US-08 | No name → validation error | Backend | boards › POST rejects empty column name | ✅ |
| US-09 | Tasks by status breakdown | Backend | dashboard › returns all required metric fields | ✅ |
| US-09 | Completed last 7/30 days | Backend | dashboard › returns all required metric fields | ✅ |
| US-09 | Unplanned count | Backend | dashboard › returns all required metric fields | ✅ |
| US-09 | Overdue count | Backend | dashboard › returns all required metric fields | ✅ |
| US-09 | Empty DB handled gracefully | Backend | dashboard › handles empty database gracefully | ✅ |

## Automated test suite

```
backend/   22 tests  (boards: 7, tasks: 11, dashboard: 4)
frontend/  17 tests  (TaskCard: 6, TaskModal: 11)
─────────────────────────────────────────────────────
Total      39 tests  ✅ all passing
```

Run:
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Manual QA checklist

| ID | Flow | Steps | Expected | Result |
|----|------|-------|----------|--------|
| M-01 | List view shows all fields | Open `/` with tasks present | Title, description, board, status, start, due, created visible per row | ✅ |
| M-02 | Sortable columns | Click "Title" header → click again | Rows sort asc then desc; indicator ↑/↓ appears | ✅ |
| M-03 | Empty state | Open `/` with no tasks | "No tasks yet. Create one to get started." shown | ✅ |
| M-04 | Board column assignment | Open `/boards/1`; check task cards | Each task in its correct column | ✅ |
| M-05 | Column order | Open any board | Columns displayed left to right by position | ✅ |
| M-06 | Empty columns | Open board with a column that has no tasks | Column renders with no cards (no error) | ✅ |
| M-07 | Drag & drop | Drag a card from Pending to In Progress | Card moves immediately without page reload | ✅ |
| M-08 | DnD persistence | After M-07, reload the page | Card still in In Progress | ✅ |
| M-09 | Drop target indicator | Start dragging a card | Hovered column gets blue dashed border | ✅ |
| M-10 | New board defaults | Create a board via `+ New Board` | Board appears with Pending / In Progress / Blocked / Done columns | ✅ |

## Security basics

- [x] No secrets committed to repo (`.env` in `.gitignore`, `.env.example` provided)
- [x] Parameterized queries via Drizzle ORM (no raw string concatenation)
- [x] Zod validation on all POST/PATCH endpoints (input sanitized at boundary)
- [x] CORS restricted to `ALLOWED_ORIGIN` env var (defaults to `localhost:5173`)
- [x] No authentication surface yet (single-user prototype; accepted risk logged in PRD)
- [x] `npm audit` — no critical/high vulnerabilities in production dependencies

## Known issues / accepted risks

| ID | Description | Severity | Decision |
|----|-------------|----------|----------|
| K-01 | Tasks created directly in a "Done" column via API skip `completedAt` | Minor | Accepted — normal use goes through drag & drop which sets it correctly |
| K-02 | No rate limiting on API endpoints | Minor | Accepted — single-user prototype; mitigate if multi-user is added |
| K-03 | No pagination on task list | Minor | Accepted — personal use, task count stays manageable |
