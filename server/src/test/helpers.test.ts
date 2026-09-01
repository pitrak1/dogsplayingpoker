import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { schemaMismatch } from '@/test/helpers'

const userSchema = z.object({ id: z.number(), username: z.string() })
const res = (body: unknown) => new Response(JSON.stringify(body), { status: 200 })

describe('schemaMismatch also catches leaked secrets', () => {
  it('returns null for a clean response', async () => {
    expect(await schemaMismatch(res({ id: 1, username: 'nick' }), userSchema)).toBeNull()
  })

  it('CATCHES a leaked password key (schema would have passed — extra keys are stripped)', async () => {
    const leaky = { id: 1, username: 'nick', password: '$2b$12$abcdefghijklmnop' }
    expect(userSchema.safeParse(leaky).success).toBe(true)      // schema check alone: passes
    const result = await schemaMismatch(res(leaky), userSchema) // helper: fails
    expect(result).toContain('leaked a secret')
  })

  it('CATCHES the hash even if the key is renamed', async () => {
    const renamed = { id: 1, username: 'nick', pwHash: '$2b$12$abcdefghijklmnop' }
    expect(await schemaMismatch(res(renamed), userSchema)).toContain('leaked a secret')
  })

  it('does NOT false-positive on a zod error path naming password', async () => {
    const zodError = { success: false, error: { issues: [{ path: ['password'], message: 'Required' }] } }
    const result = await schemaMismatch(res(zodError), userSchema)
    expect(result).not.toContain('leaked a secret')  // reports a schema mismatch instead
    expect(result).toContain('Invalid input')
  })

  it('still reports ordinary schema mismatches', async () => {
    expect(await schemaMismatch(res({ id: 'nope' }), userSchema)).toContain('Invalid input')
  })
})
