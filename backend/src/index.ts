import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { seed } from './db/seed'
import boardsRouter from './routes/boards'
import tasksRouter  from './routes/tasks'

const app = new Hono()

app.use(logger())
app.use('*', cors({ origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173' }))

const api = new Hono()
api.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))
api.route('/boards', boardsRouter)
api.route('/tasks',  tasksRouter)

app.route('/api', api)

const port = Number(process.env.PORT) || 3000

seed()
  .then(() => {
    serve({ fetch: app.fetch, port }, () => {
      console.log(`Backend running on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Startup failed', err)
    process.exit(1)
  })
