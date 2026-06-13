import 'dotenv/config'
import { sql } from './index'
import { seed } from './seed'

seed()
  .then(() => sql.end())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error(err)
    await sql.end()
    process.exit(1)
  })
