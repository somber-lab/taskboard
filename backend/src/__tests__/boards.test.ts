import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'
import boardsRouter from '../routes/boards'

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
  app.route('/boards', boardsRouter)
  return app
}

// Each method returns a new Promise so the drizzle chain can be awaited at any depth
function chainable(result: unknown): any {
  const p: any = Promise.resolve(result)
  const fns = ['from','where','orderBy','leftJoin','groupBy','returning','values','set']
  fns.forEach(f => { p[f] = () => chainable(result) })
  return p
}

const fakeBoard = {
  id: 1, name: 'My Board', isDefault: true,
  createdAt: new Date().toISOString(),
}
const fakeCols = [
  { id: 1, boardId: 1, name: 'Pending',     position: 0, isDone: false, createdAt: new Date().toISOString() },
  { id: 2, boardId: 1, name: 'In Progress', position: 1, isDone: false, createdAt: new Date().toISOString() },
  { id: 3, boardId: 1, name: 'Blocked',     position: 2, isDone: false, createdAt: new Date().toISOString() },
  { id: 4, boardId: 1, name: 'Done',        position: 3, isDone: true,  createdAt: new Date().toISOString() },
]

describe('GET /boards', () => {
  it('returns list of boards', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fakeBoard]) as never)
    const res = await makeApp().request('/boards')
    expect(res.status).toBe(200)
    const body = await res.json() as typeof fakeBoard[]
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('My Board')
  })
})

describe('GET /boards/:id', () => {
  it('returns 404 for unknown board', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]) as never)
    const res = await makeApp().request('/boards/999')
    expect(res.status).toBe(404)
  })

  it('returns the board when found', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fakeBoard]) as never)
    const res = await makeApp().request('/boards/1')
    expect(res.status).toBe(200)
    const body = await res.json() as typeof fakeBoard
    expect(body.id).toBe(1)
  })
})

describe('POST /boards — validation (US-07)', () => {
  it('rejects empty name', async () => {
    const res = await makeApp().request('/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    expect(res.status).toBe(400)
  })

  it('rejects missing name', async () => {
    const res = await makeApp().request('/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /boards/:boardId/columns', () => {
  it('returns columns for a board', async () => {
    vi.mocked(db.select).mockReturnValue(chainable(fakeCols) as never)
    const res = await makeApp().request('/boards/1/columns')
    expect(res.status).toBe(200)
    const body = await res.json() as typeof fakeCols
    expect(body).toHaveLength(4)
    expect(body.map((c) => c.name)).toEqual(['Pending', 'In Progress', 'Blocked', 'Done'])
  })
})

describe('POST /boards/:boardId/columns — validation (US-08)', () => {
  it('rejects empty column name', async () => {
    const res = await makeApp().request('/boards/1/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    expect(res.status).toBe(400)
  })
})
