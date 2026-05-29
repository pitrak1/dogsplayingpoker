import { describe, it, expect, beforeEach } from 'vitest'
import { authMiddleware,requireAuth } from './auth'
import { Hono } from 'hono'
import type { AppEnv } from '@/types'
import { generateAuthToken } from '@/lib/auth'

describe('authMiddleware', () => {
  const app = new Hono<AppEnv>()
    .use(authMiddleware)
    .get('/me', (c) => c.json({ userId: c.get('userId') ?? null }))

  it('sets userId for a valid token', async () => {
    const token = generateAuthToken(42)
    const res = await app.request('/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(await res.json()).toEqual({ userId: 42 })
  })

  it('leaves userId unset without a token', async () => {
    const res = await app.request('/me')
    expect(await res.json()).toEqual({ userId: null })
  })

  it('leaves userId unset for an invalid token', async () => {
    const res = await app.request('/me', {
      headers: { Authorization: 'Bearer not-a-token' },
    })
    expect(await res.json()).toEqual({ userId: null })
  })
})

describe('requireAuth', () => {
  const app = new Hono<AppEnv>()
    .use(authMiddleware)
    .use(requireAuth)
    .get('/protected', (c) => c.json({ ok: true }))

  it('returns 401 without a token', async () => {
    const res = await app.request('/protected')
    expect(res.status).toBe(401)
  })

  it('allows requests with a valid token', async () => {
    const token = generateAuthToken(42)
    const res = await app.request('/protected', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
  })
})