import { zValidator } from '@hono/zod-validator'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../db/index'
import { boards, columns, tasks } from '../db/schema'

const moveSchema = z.object({ columnId: z.number().int().positive() })

const router = new Hono()

const SORTABLE = {
  title:       tasks.title,
  description: tasks.description,
  startDate:   tasks.startDate,
  endDate:     tasks.endDate,
  createdAt:   tasks.createdAt,
  boardName:   boards.name,
  columnName:  columns.name,
} as const

type SortKey = keyof typeof SORTABLE

router.get('/', async (c) => {
  const boardIdParam = c.req.query('boardId')
  const sortKey = (c.req.query('sort') ?? 'createdAt') as SortKey
  const order   = c.req.query('order') ?? 'asc'

  const sortCol = SORTABLE[sortKey] ?? tasks.createdAt
  const orderFn = order === 'desc' ? desc : asc

  const base = db
    .select({
      id:          tasks.id,
      boardId:     tasks.boardId,
      columnId:    tasks.columnId,
      title:       tasks.title,
      description: tasks.description,
      startDate:   tasks.startDate,
      endDate:     tasks.endDate,
      completedAt: tasks.completedAt,
      createdAt:   tasks.createdAt,
      updatedAt:   tasks.updatedAt,
      boardName:   boards.name,
      columnName:  columns.name,
    })
    .from(tasks)
    .leftJoin(boards,  eq(tasks.boardId,  boards.id))
    .leftJoin(columns, eq(tasks.columnId, columns.id))

  const result = boardIdParam
    ? await base.where(eq(tasks.boardId, Number(boardIdParam))).orderBy(orderFn(sortCol))
    : await base.orderBy(orderFn(sortCol))

  return c.json(result)
})

router.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid task id' }, 400)
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
  if (!task) return c.json({ error: 'Task not found' }, 404)
  return c.json(task)
})

const createTaskSchema = z.object({
  boardId:     z.number().int().positive(),
  columnId:    z.number().int().positive(),
  title:       z.string().min(1).max(500),
  description: z.string().min(1),
  startDate:   z.string().nullable().optional(),
  endDate:     z.string().nullable().optional(),
})

router.post('/', zValidator('json', createTaskSchema), async (c) => {
  const data = c.req.valid('json')
  const [task] = await db
    .insert(tasks)
    .values({
      boardId:     data.boardId,
      columnId:    data.columnId,
      title:       data.title,
      description: data.description,
      startDate:   data.startDate ?? null,
      endDate:     data.endDate   ?? null,
    })
    .returning()
  return c.json(task, 201)
})

router.patch('/:id/move', zValidator('json', moveSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid task id' }, 400)
  const { columnId } = c.req.valid('json')

  const [[task], [targetCol]] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.id, id)),
    db.select().from(columns).where(eq(columns.id, columnId)),
  ])
  if (!task)      return c.json({ error: 'Task not found' }, 404)
  if (!targetCol) return c.json({ error: 'Column not found' }, 404)

  const completedAt = targetCol.isDone
    ? (task.completedAt ?? sql`now()`)
    : null

  const [updated] = await db
    .update(tasks)
    .set({ columnId, completedAt, updatedAt: sql`now()` })
    .where(eq(tasks.id, id))
    .returning()

  return c.json(updated)
})

export default router
