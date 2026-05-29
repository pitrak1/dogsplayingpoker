import { describe, it, expect } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'

describe('POST /api/media/upload-signature', () => {
  it('returns a signature', async () => {
    const token = generateAuthToken(1)
    const res = await app.request('/api/media/upload-signature', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.timestamp).toBeTypeOf('number')
    expect(body.signature).toBeTypeOf('string')
  })
})