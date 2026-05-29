import { describe, it, expect } from 'vitest'
import { app } from '@/app'
import { generateRefreshToken } from '@/lib/auth'

describe('POST /api/auth/login', () => {
  it('rejects requests with missing fields', async () => {
    const noPasswordBody = JSON.stringify({ email: 'sarah@example.com' })
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: noPasswordBody,
    })
    expect(res.status).toBe(400)
  })

  it('rejects invalid email format', async () => {
    const wrongEmailFormatBody = JSON.stringify({ 
      email: 'not-an-email', 
      password: 'whatever'
    })
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: wrongEmailFormatBody
    })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/register', () => {
  it('rejects requests with missing fields', async () => {
    const noPasswordBody = JSON.stringify({ 
      username: 'sarah-ex', 
      email: 'sarah@example.com' 
    })
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: noPasswordBody,
    })
    expect(res.status).toBe(400)
  })
})

describe ('POST /api/auth/refresh', () => {
  it('returns 401 when no refresh cookie is present', async () => {
    const res = await app.request('/api/auth/refresh', { method: 'POST' })
    expect(res.status).toBe(401)
  })

  it('returns 401 when the refresh token is invalid', async () => {
    const res = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { Cookie: 'refreshToken=not-a-real-token' },
    })
    expect(res.status).toBe(401)
  })

  it('returns a new auth token for a valid refresh cookie', async () => {
    const token = generateRefreshToken(1)
    const res = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { Cookie: `refreshToken=${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.authToken).toBeTypeOf('string')
  })
})