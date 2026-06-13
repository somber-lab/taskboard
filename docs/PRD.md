# Taskboard — Product Requirements

## Problem statement

Managing personal tasks without a unified tool leads to fragmented lists and no visibility
into actual progress. A single workspace that supports both free-form list browsing and
structured Kanban boards — with a dashboard to see how things are actually moving — solves
that for a solo user without the overhead of heavyweight project-management tools.

## Target users

Single user (personal use). No authentication or multi-tenancy required for v1.

## Core value proposition

One personal workspace to capture, organize, and track tasks — list or board view, whichever
fits the moment — with a dashboard that shows whether work is actually moving.

## Goals (v1)

1. Create, edit, and delete tasks with title, description, and optional start/end dates.
2. Organize tasks across multiple named Kanban boards; one default board always exists.
3. Each board has configurable columns (default set: Pending / In Progress / Blocked / Done).
4. Move tasks between columns by drag and drop.
5. View all tasks in a flat, sortable list (sortable by every column).
6. Monitor work through a metrics dashboard (see § Success criteria).

## Non-goals (explicitly out of scope for v1)

- User authentication / login / multi-user support.
- Native mobile app (browser only).
- Push notifications or reminders.
- Recurring tasks.
- Team collaboration or board sharing.

## Constraints

- Platform: modern web browser only.
- No prescribed technology stack.
- No hard delivery deadline.

## Success criteria

All v1 acceptance criteria are met when:

- Full CRUD works for tasks and boards without data loss.
- Drag-and-drop column transitions persist correctly across page reloads.
- List view sorts by every task field without errors.
- Dashboard displays at minimum:
  - Task count by status across all boards.
  - Tasks completed in the last 7 and 30 days.
  - Tasks with no end date (unplanned).
  - Overdue tasks (end date in the past and not done).

## Open questions

None blocking Phase 1.
