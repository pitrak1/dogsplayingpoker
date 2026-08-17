import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// A connection dropped while idle (Neon suspending, a network blip) emits 'error' on the
// pool itself. With no listener, Node treats it as unhandled and kills the process.
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err)
})

export const db = drizzle(pool, { schema })
