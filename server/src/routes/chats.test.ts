import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'

describe('GET /api/chats', () => {
  it('returns 400 if authenticated user is not requested user', async () => {
    const token = generateAuthToken(1)
    const res = await app.request(`/api/chats?userId=${2}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(400)
  })
})