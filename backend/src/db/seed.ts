import { eq } from 'drizzle-orm'
import { db } from './index'
import { boards, columns } from './schema'

export async function seed() {
  const existing = await db.select().from(boards).where(eq(boards.isDefault, true))
  if (existing.length > 0) return

  const [board] = await db.insert(boards).values({
    name: 'My Board',
    isDefault: true,
  }).returning()

  await db.insert(columns).values([
    { boardId: board.id, name: 'Pending',     position: 0, isDone: false },
    { boardId: board.id, name: 'In Progress', position: 1, isDone: false },
    { boardId: board.id, name: 'Blocked',     position: 2, isDone: false },
    { boardId: board.id, name: 'Done',        position: 3, isDone: true  },
  ])

  console.log('Default board seeded')
}
