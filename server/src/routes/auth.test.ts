import { describe, it, expect } from 'vitest'
import { app } from '@/app'
import { generateRefreshToken } from '@/lib/auth'
import { beforeEach } from 'vitest'
import { resetDb, schemaMismatch, MISSING_ID } from '@/test/helpers'
import { setupUser } from '@/test/factories'
import { authResponseSchema } from 'dogsplayingpoker-shared/user'

beforeEach(resetDb)


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

  it('response matches authResponseSchema', async () => {
    await setupUser()
    const res = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'hashed' }),
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, authResponseSchema)).toBeNull()
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

  it('response matches authResponseSchema', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'brandnew',
        email: 'brandnew@example.com',
        password: 'password1234',
      }),
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, authResponseSchema)).toBeNull()
  })

})

describe('POST /api/auth/refresh', () => {
  const refreshWith = (cookie?: string) =>
    app.request('/api/auth/refresh', {
      method: 'POST',
      headers: cookie ? { Cookie: cookie } : {},
    })

  it('returns 401 when no refresh cookie is present', async () => {
    const res = await refreshWith()
    expect(res.status).toBe(401)
  })

  it('returns 401 and clears the cookie when the refresh token is invalid', async () => {
    const res = await refreshWith('refreshToken=not-a-real-token')
    expect(res.status).toBe(401)
    expect(res.headers.get('set-cookie')).toMatch(/refreshToken=;/)
  })

  it('returns 401 and clears the cookie when the token belongs to a user that no longer exists', async () => {
    const res = await refreshWith(`refreshToken=${generateRefreshToken(MISSING_ID)}`)
    expect(res.status).toBe(401)
    expect(res.headers.get('set-cookie')).toMatch(/refreshToken=;/)
  })

  it('returns 401 when the user has been soft-deleted', async () => {
    const user = await setupUser({ deletedAt: new Date() })
    const res = await refreshWith(`refreshToken=${generateRefreshToken(user.id)}`)
    expect(res.status).toBe(401)
  })

  it('returns a new auth token and the user for a valid refresh cookie', async () => {
    const user = await setupUser()
    const res = await refreshWith(`refreshToken=${generateRefreshToken(user.id)}`)
    expect(res.status).toBe(200)
    // schemaMismatch consumes the body, so clone before parsing it again below
    expect(await schemaMismatch(res.clone(), authResponseSchema)).toBeNull()
    const body = await res.json()
    expect(body.authToken).toBeTypeOf('string')
    expect(body.user.id).toBe(user.id)
    expect(body.user.username).toBe(user.username)
  })

  it('does not touch the refresh cookie on success', async () => {
    const user = await setupUser()
    const res = await refreshWith(`refreshToken=${generateRefreshToken(user.id)}`)
    expect(res.headers.get('set-cookie')).toBeNull()
  })
})
