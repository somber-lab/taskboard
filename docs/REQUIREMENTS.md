# Taskboard — Requirements

## User stories

### Must have (MVP)

---

**US-01** — Sortable task list
As a user, I want to see all my tasks in a sortable flat list so that I can quickly scan and
find tasks across all boards.

Acceptance criteria:
- Given the list view is open, then I see every task with its title, description, start date,
  end date, board name, and current column.
- Given the list view is open, when I click any column header, then tasks are sorted by that
  field in ascending order; clicking again toggles to descending.
- Given there are no tasks, then the list shows an empty state message.

---

**US-02** — Create a task
As a user, I want to create a new task so that I can start tracking a piece of work.

Acceptance criteria:
- Given the task creation form is open, when I submit with a valid title and description,
  then the task is saved and appears in the default column of the assigned board.
- Given the task creation form is open, when I submit with an empty title or empty description,
  then the form shows a validation error and does not save.
- Given the task creation form is open, then the board selector is pre-populated with the
  default board; I can change it to any existing board.
- Given the task creation form is open, then start date and end date fields are optional;
  the task saves successfully without them.

---

**US-03** — Edit a task
As a user, I want to edit an existing task so that I can update its details as work evolves.

Acceptance criteria:
- Given a task exists, when I open its edit form and change any field and save, then the
  updated values are persisted and visible in all views.
- Given the edit form is open, when I clear the title or description and try to save,
  then a validation error is shown and the change is not persisted.

---

**US-04** — Delete a task
As a user, I want to delete a task so that I can remove work that is no longer relevant.

Acceptance criteria:
- Given a task exists, when I delete it and confirm, then it no longer appears in the list
  view, on the board, or in the dashboard metrics.
- Given a deletion is triggered, then a confirmation step is required before the task is removed.

---

**US-05** — View a Kanban board
As a user, I want to view a Kanban board so that I can see my tasks organized by status.

Acceptance criteria:
- Given a board exists with tasks, when I open the board view, then tasks are displayed in
  their respective columns in card format showing at minimum the title.
- Given a board has multiple columns, then columns are displayed left to right.
- Given a board has no tasks, then columns are shown with an empty state.

---

**US-06** — Move tasks by drag and drop
As a user, I want to drag tasks between columns on a board so that I can update their status
without opening an edit form.

Acceptance criteria:
- Given a task is in column A, when I drag it and drop it onto column B, then the task
  appears in column B immediately.
- Given I drag a task to a new column, when I reload the page, then the task is still in
  column B (state is persisted).
- Given a drag operation is in progress, then a visual indicator shows the valid drop targets.

---

**US-07** — Create a new board
As a user, I want to create additional Kanban boards so that I can separate different areas
of my work.

Acceptance criteria:
- Given I create a new board with a name, then it is saved and immediately selectable when
  creating tasks.
- Given a new board is created, then it comes pre-loaded with the four default columns:
  Pending, In Progress, Blocked, Done.
- Given I try to create a board without a name, then a validation error is shown.

---

**US-08** — Add a column to a board
As a user, I want to add custom columns to a board so that I can tailor the workflow to
my specific needs.

Acceptance criteria:
- Given a board is open, when I add a new column with a name, then it appears at the right
  end of the board and is immediately available to receive tasks.
- Given I try to add a column without a name, then a validation error is shown.

---

**US-09** — Metrics dashboard
As a user, I want a metrics dashboard so that I can understand the overall state and progress
of my work.

Acceptance criteria:
- Given the dashboard is open, then I see the total count of tasks broken down by status
  across all boards.
- Given the dashboard is open, then I see the number of tasks completed (moved to Done) in
  the last 7 days and in the last 30 days.
- Given the dashboard is open, then I see the count of tasks that have no end date (unplanned).
- Given the dashboard is open, then I see the count of tasks whose end date is in the past
  and whose current column is not Done (overdue).

---

### Should have (post-MVP)

**US-10** — Rename a board
As a user, I want to rename a board so that I can correct or update its name over time.
- Given a board exists, when I rename it, then the new name is reflected everywhere.

**US-11** — Delete a board
As a user, I want to delete a board I no longer need (with confirmation and handling of
its tasks).
- Given a board has tasks, when I delete it, then I am warned and given a choice to
  reassign tasks to another board or delete them along with the board.

**US-12** — Rename a column
As a user, I want to rename a column on a board so that I can adjust its label.
- Given a column exists, when I rename it, then the new name is saved immediately.

**US-13** — Reorder columns
As a user, I want to drag columns within a board to reorder them so that my workflow reads
in the right order.
- Given a board is open, when I drag a column header to a new position, then the column
  moves and the order is persisted.

---

### Could have (backlog)

**US-14** — Filter tasks in list view
As a user, I want to filter the task list by board or status so that I can focus on a
specific subset.

**US-15** — Search tasks
As a user, I want to search tasks by title so that I can find a specific task quickly.

**US-16** — Delete a column
As a user, I want to remove a column from a board (reassigning its tasks first) so that
I can clean up unused workflow stages.

---

## Domain entities (first pass)

**Task**
Attributes: title (required), description (required), start_date (optional), end_date (optional),
created_at.
Relationships: belongs to one Board; belongs to one Column within that Board.

**Board**
Attributes: name (required), is_default (boolean — exactly one board is the default).
Relationships: has many Columns; has many Tasks (through Columns).

**Column**
Attributes: name (required), position (integer — display order within the board).
Relationships: belongs to one Board; has many Tasks.

---

## Non-functional requirements

Deferred — prototype classification. Will be addressed if the project scales to production.

---

## Assumptions

- A task always belongs to exactly one board and one column at a time.
- The default board cannot be deleted (only renamed in US-10).
- "Done" is identified by the `is_done` boolean flag on columns (ADR-005, Phase 2).
  Renaming a column does not affect completion tracking.
- The app will have a backend API from day one. Data is persisted server-side, not in the
  browser. This drives the Phase 2 stack recommendation.

---

## Out of scope (carried from PRD)

- User authentication / multi-user support.
- Native mobile app.
- Push notifications or reminders.
- Recurring tasks.
- Team collaboration or board sharing.
