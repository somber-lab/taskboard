import { and, count, isNull, lt, gte, isNotNull, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/index'
import { columns, tasks } from '../db/schema'
import { eq } from 'drizzle-orm'

const router = new Hono()

router.get('/', async (c) => {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const sevenDaysAgo  = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7)
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)

  const [byStatusRows, completedLast7, completedLast30, unplannedRow, overdueRow] = await Promise.all([
    // tasks per column
    db
      .select({ columnName: columns.name, count: count() })
      .from(tasks)
      .leftJoin(columns, eq(tasks.columnId, columns.id))
      .groupBy(columns.name),

    // completed in last 7 days
    db
      .select({ count: count() })
      .from(tasks)
      .where(gte(tasks.completedAt, sevenDaysAgo)),

    // completed in last 30 days
    db
      .select({ count: count() })
      .from(tasks)
      .where(gte(tasks.completedAt, thirtyDaysAgo)),

    // unplanned: no startDate AND no endDate
    db
      .select({ count: count() })
      .from(tasks)
      .where(and(isNull(tasks.startDate), isNull(tasks.endDate))),

    // overdue: endDate < today AND not completed
    db
      .select({ count: count() })
      .from(tasks)
      .where(and(lt(tasks.endDate, todayStr), isNull(tasks.completedAt))),
  ])

  return c.json({
    byStatus:           byStatusRows.map(r => ({ columnName: r.columnName ?? 'Unknown', count: Number(r.count) })),
    completedLast7Days:  Number(completedLast7[0]?.count  ?? 0),
    completedLast30Days: Number(completedLast30[0]?.count ?? 0),
    unplanned:           Number(unplannedRow[0]?.count    ?? 0),
    overdue:             Number(overdueRow[0]?.count      ?? 0),
  })
})

export default router
