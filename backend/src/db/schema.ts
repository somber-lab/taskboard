import { boolean, date, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const boards = pgTable('boards', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 255 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const columns = pgTable('columns', {
  id:        serial('id').primaryKey(),
  boardId:   integer('board_id').notNull().references(() => boards.id, { onDelete: 'cascade' }),
  name:      varchar('name', { length: 255 }).notNull(),
  position:  integer('position').notNull(),
  isDone:    boolean('is_done').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tasks = pgTable('tasks', {
  id:          serial('id').primaryKey(),
  boardId:     integer('board_id').notNull().references(() => boards.id, { onDelete: 'cascade' }),
  columnId:    integer('column_id').notNull().references(() => columns.id, { onDelete: 'restrict' }),
  title:       varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  startDate:   date('start_date'),
  endDate:     date('end_date'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
