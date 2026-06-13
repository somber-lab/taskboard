# Taskboard — Backlog

Items deferred from the MVP. Ordered by priority within each tier.

---

## Post-MVP (Should have)

### US-10 — Rename a board
Inline edit on the board name in `BoardsPage` and `BoardPage` header.  
**Approach**: click-to-edit input with `PATCH /api/boards/:id`. Already have the route structure; add the endpoint and a small inline form component.

### US-11 — Delete a board
Delete button on `BoardsPage` with two-step confirm.  
**Approach**: add `DELETE /api/boards/:id` (cascade deletes columns and tasks via FK). Warn the user that all tasks on that board will be lost. The default board should be protected from deletion.

### US-12 — Rename a column
Inline edit on column header in `BoardPage`.  
**Approach**: `PATCH /api/boards/:boardId/columns/:columnId`. Straightforward — same pattern as board rename.

### US-13 — Reorder columns
Drag column headers to change their display order.  
**Approach**: extend `@dnd-kit` already in the project — add a horizontal `SortableContext` around the columns. On drop, send `PATCH /api/boards/:boardId/columns/reorder` with the new position array. The `position` field already exists in the schema.

---

## Backlog (Could have)

### US-14 — Filter tasks in list view
Filter bar above the table: by board and/or by status column.  
**Approach**: client-side filtering with TanStack Table's `getFilteredRowModel` (already imported). No backend changes needed for basic filtering; add `columnFilters` state to `ListPage`.

### US-15 — Search tasks
Full-text search by title in the list view.  
**Approach**: add a search input that filters the `title` column via TanStack Table's global filter. For server-side search, add `?q=` param to `GET /api/tasks` and use PostgreSQL `ILIKE`.

### US-16 — Delete a column
Remove a column from a board, reassigning its tasks first.  
**Approach**: requires a "reassign tasks to column X before deleting" modal. Most complex of the backlog items — deferred until US-12/US-13 are done.

---

## Known issues (accepted in v1.0.0)

| ID | Description | Workaround |
|----|-------------|------------|
| K-01 | Tasks created via API directly in a Done column don't get `completedAt` set | Use drag & drop in the UI — sets `completedAt` correctly via `/move` endpoint |
| K-02 | No rate limiting on API endpoints | Single-user app on private network; revisit if exposed publicly |
| K-03 | No pagination on task list | Manageable at personal-use scale; add if list grows unwieldy |

---

## Ideas for later

- **Due-date reminders** — browser notification or email when a task's `endDate` is tomorrow.
- **Task labels / tags** — free-form tags for cross-board categorisation.
- **Recurring tasks** — repeat a task on a schedule (weekly review, etc.).
- **Completed tasks archive** — hide done tasks from the board but keep them for metrics.
- **Keyboard shortcuts** — `n` new task, `e` edit, `j/k` navigate rows in list view.
- **Dark mode** — CSS variable theming, Tailwind already supports it.
