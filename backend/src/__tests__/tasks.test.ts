import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'
import tasksRouter from '../routes/tasks'

vi.mock('../db/index', () => ({
  db: {
    select:  vi.fn(),
    insert:  vi.fn(),
    update:  vi.fn(),
    delete:  vi.fn(),
  },
}))

function makeApp() {
  const app = new Hono()
  app.route('/tasks', tasksRouter)
  return app
}

function chainable(result: unknown): any {
  const p: any = Promise.resolve(result)
  const fns = ['from','where','orderBy','leftJoin','groupBy','returning','values','set']
  fns.forEach(f => { p[f] = () => chainable(result) })
  return p
}

const fakeTask = {
  id: 1, boardId: 1, columnId: 1,
  title: 'Test task', description: 'A description',
  startDate: null, endDate: null, completedAt: null,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}

import { db } from '../db/index'

describe('POST /tasks — validation (US-02)', () => {
  it('rejects empty title', async () => {
    const res = await makeApp().request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: 1, columnId: 1, title: '', description: 'desc' }),
    })
    expect(res.status).toBe(400)
  })

  it('rejects empty description', async () => {
    const res = await makeApp().request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: 1, columnId: 1, title: 'Title', description: '' }),
    })
    expect(res.status).toBe(400)
  })

  it('rejects missing boardId', async () => {
    const res = await makeApp().request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columnId: 1, title: 'Title', description: 'desc' }),
    })
    expect(res.status).toBe(400)
  })

  it('accepts task without dates', async () => {
    vi.mocked(db.insert).mockReturnValue(chainable([fakeTask]) as never)
    const res = await makeApp().request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: 1, columnId: 1, title: 'Title', description: 'desc' }),
    })
    expect(res.status).toBe(201)
  })
})

describe('PATCH /tasks/:id — validation (US-03)', () => {
  it('rejects empty title on update', async () => {
    const res = await makeApp().request('/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    })
    expect(res.status).toBe(400)
  })

  it('rejects empty description on update', async () => {
    const res = await makeApp().request('/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: '' }),
    })
    expect(res.status).toBe(400)
  })

  it('returns 404 when task not found', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]) as never)
    const res = await makeApp().request('/tasks/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New title' }),
    })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /tasks/:id (US-04)', () => {
  it('returns 404 when task not found', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]) as never)
    const res = await makeApp().request('/tasks/999', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })

  it('returns 204 on successful delete', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fakeTask]) as never)
    vi.mocked(db.delete).mockReturnValue(chainable(undefined) as never)
    const res = await makeApp().request('/tasks/1', { method: 'DELETE' })
    expect(res.status).toBe(204)
  })
})

describe('PATCH /tasks/:id/move — completedAt logic (US-06)', () => {
  it('returns 404 when task not found', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]) as never)
    const res = await makeApp().request('/tasks/999/move', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columnId: 2 }),
    })
    expect(res.status).toBe(404)
  })

  it('rejects invalid columnId', async () => {
    const res = await makeApp().request('/tasks/1/move', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columnId: 0 }),
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /tasks/:id', () => {
  it('returns 400 for non-numeric id', async () => {
    const res = await makeApp().request('/tasks/abc')
    expect(res.status).toBe(400)
  })

  it('returns 404 for unknown id', async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]) as never)
    const res = await makeApp().request('/tasks/999')
    expect(res.status).toBe(404)
  })
})
