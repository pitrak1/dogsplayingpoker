import 'dotenv/config'
import { Pool } from 'pg'

// One-off backfill for rows written before emails were normalised on insert.
// loginUser now lowercases the address before querying, so anyone stored with
// mixed case can no longer log in until their row is fixed.
//
// Run once per environment:  pnpm db:normalize-emails
// Safe to re-run; it only touches rows that aren't already normalised.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const normalizeEmails = async () => {
  // Rows that would collide with an existing account once lowercased. These are
  // genuinely two accounts for one address and need a human decision about which
  // to keep, so leave them alone rather than failing the unique constraint mid-run.
  const { rows: collisions } = await pool.query<{
    normalized: string
    ids: number[]
    emails: string[]
  }>(`
    SELECT lower(btrim(email)) AS normalized,
           array_agg(id ORDER BY id) AS ids,
           array_agg(email ORDER BY id) AS emails
    FROM users
    WHERE deleted_at IS NULL
    GROUP BY lower(btrim(email))
    HAVING count(*) > 1
  `)

  if (collisions.length > 0) {
    console.warn(`\n${collisions.length} address(es) map to more than one account — SKIPPED:`)
    for (const c of collisions) {
      console.warn(`  ${c.normalized}: ids ${c.ids.join(', ')} (${c.emails.join(', ')})`)
    }
    console.warn('Resolve these by hand, then re-run.\n')
  }

  const { rows: updated } = await pool.query<{ id: number; email: string }>(`
    UPDATE users
    SET email = lower(btrim(email)), updated_at = now()
    WHERE email <> lower(btrim(email))
      AND lower(btrim(email)) NOT IN (
        SELECT lower(btrim(email))
        FROM users
        WHERE deleted_at IS NULL
        GROUP BY lower(btrim(email))
        HAVING count(*) > 1
      )
    RETURNING id, email
  `)

  console.log(`Normalised ${updated.length} row(s).`)
  for (const u of updated) console.log(`  ${u.id} -> ${u.email}`)

  await pool.end()
  if (collisions.length > 0) process.exitCode = 1
}

normalizeEmails().catch((e) => {
  console.error(e)
  process.exit(1)
})
