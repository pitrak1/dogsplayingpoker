import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureExtensions() {
  await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;')
  console.log('PostGIS ready.')
  await pool.end()
}

ensureExtensions().catch((e) => {
  console.error(e)
  process.exit(1)
})
