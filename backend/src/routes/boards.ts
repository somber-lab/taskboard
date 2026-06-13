import { zValidator } from '@hono/zod-validator'
import { eq, max } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../db/index'
import { boards, columns } from '../db/schema'

const router = new Hono()

router.get('/', async (c) => {
  const all = await db.select().from(boards).orderBy(boards.createdAt)
  return c.json(all)
})

router.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid board id' }, 400)
  const [board] = await db.select().from(boards).where(eq(boards.id, id))
  if (!board) return c.json({ error: 'Board not found' }, 404)
  return c.json(board)
})

router.post(
  '/',
  zValidator('json', z.object({ name: z.string().min(1).max(255) })),
  async (c) => {
    const { name } = c.req.valid('json')
    const [board] = await db.insert(boards).values({ name, isDefault: false }).returning()
    const boardColumns = await db.insert(columns).values([
      { boardId: board.id, name: 'Pending',     position: 0, isDone: false },
      { boardId: board.id, name: 'In Progress', position: 1, isDone: false },
      { boardId: board.id, name: 'Blocked',     position: 2, isDone: false },
      { boardId: board.id, name: 'Done',        position: 3, isDone: true  },
    ]).returning()
    return c.json({ ...board, columns: boardColumns }, 201)
  },
)

router.get('/:boardId/columns', async (c) => {
  const boardId = Number(c.req.param('boardId'))
  if (isNaN(boardId)) return c.json({ error: 'Invalid board id' }, 400)
  const cols = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId))
    .orderBy(columns.position)
  return c.json(cols)
})

router.post(
  '/:boardId/columns',
  zValidator('json', z.object({ name: z.string().min(1).max(255) })),
  async (c) => {
    const boardId = Number(c.req.param('boardId'))
    if (isNaN(boardId)) return c.json({ error: 'Invalid board id' }, 400)
    const { name } = c.req.valid('json')
    const [{ maxPos }] = await db
      .select({ maxPos: max(columns.position) })
      .from(columns)
      .where(eq(columns.boardId, boardId))
    const position = (maxPos ?? -1) + 1
    const [column] = await db
      .insert(columns)
      .values({ boardId, name, position, isDone: false })
      .returning()
    return c.json(column, 201)
  },
)

export default router
