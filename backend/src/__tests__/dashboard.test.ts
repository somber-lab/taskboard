import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'
import dashboardRouter from '../routes/dashboard'

vi.mock('../db/index', () => ({
  db: {
    select:  vi.fn(),
    insert:  vi.fn(),
    update:  vi.fn(),
    delete:  vi.fn(),
  },
}))

import { db } from '../db/index'

function makeApp() {
  const app = new Hono()
  app.route('/dashboard', dashboardRouter)
  return app
}

function chainable(result: unknown): any {
  const p: any = Promise.resolve(result)
  const fns = ['from','where','orderBy','leftJoin','groupBy','returning','values','set']
  fns.forEach(f => { p[f] = () => chainable(result) })
  return p
}

describe('GET /dashboard (US-09)', () => {
  it('returns all required metric fields', async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([{ columnName: 'Done', count: 5 }, { columnName: 'Pending', count: 3 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 2 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 8 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 1 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 4 }]) as never)

    const res = await makeApp().request('/dashboard')
    expect(res.status).toBe(200)

    const body = await res.json() as {
      byStatus: { columnName: string; count: number }[]
      completedLast7Days: number
      completedLast30Days: number
      unplanned: number
      overdue: number
    }

    expect(body).toHaveProperty('byStatus')
    expect(body).toHaveProperty('completedLast7Days')
    expect(body).toHaveProperty('completedLast30Days')
    expect(body).toHaveProperty('unplanned')
    expect(body).toHaveProperty('overdue')

    expect(body.byStatus).toHaveLength(2)
    expect(body.completedLast7Days).toBe(2)
    expect(body.completedLast30Days).toBe(8)
    expect(body.unplanned).toBe(1)
    expect(body.overdue).toBe(4)
  })

  it('handles empty database gracefully', async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([]) as never)
      .mockReturnValueOnce(chainable([{ count: 0 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 0 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 0 }]) as never)
      .mockReturnValueOnce(chainable([{ count: 0 }]) as never)

    const res = await makeApp().request('/dashboard')
    expect(res.status).toBe(200)
    const body = await res.json() as { byStatus: unknown[] }
    expect(body.byStatus).toHaveLength(0)
  })
})
