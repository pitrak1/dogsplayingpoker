import { describe, it, expect, beforeEach } from 'vitest'
import { app } from '@/app'
import { resetDb } from '@/test/helpers'
import { setupUser } from '@/test/factories'
import { hashEmail } from '@/lib/rateLimit'
import { loginAccountLimiter } from '@/lib/limiters'

beforeEach(resetDb)

const postJson = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })

const register = (n: number, ip = '203.0.113.1') =>
  postJson(
    '/api/auth/register',
    { username: `user${n}`, email: `user${n}@example.com`, password: 'password123' },
    { 'x-forwarded-for': ip },
  )

describe('POST /api/auth/register', () => {
  it('429s past the limit and sets Retry-After', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await register(i)).status, `request ${i + 1}`).not.toBe(429)
    }

    const res = await register(5)
    expect(res.status).toBe(429)
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0)
  })

  it('counts per IP rather than globally', async () => {
    for (let i = 0; i < 5; i++) await register(i, '203.0.113.1')
    expect((await register(5, '203.0.113.1')).status).toBe(429)

    // A different client shouldn't inherit the first one's exhausted budget.
    expect((await register(6, '198.51.100.7')).status).not.toBe(429)
  })

  it('reads the last x-forwarded-for entry, not the client-supplied first', async () => {
    // A forged leftmost entry is how you bypass a naive split(',')[0].
    const spoofed = 'evil-spoof, 203.0.113.1'
    for (let i = 0; i < 5; i++) await register(i, spoofed)
    expect((await register(5, 'other-spoof, 203.0.113.1')).status).toBe(429)
  })
})

describe('POST /api/auth/login', () => {
  // Derived from the limiter so retuning the numbers doesn't silently break these.
  const POINTS = loginAccountLimiter.points

  const login = (password: string, ip = '203.0.113.50') =>
    postJson('/api/auth/login', { email: 'test@example.com', password }, { 'x-forwarded-for': ip })

  it('locks the account out after repeated failures', async () => {
    await setupUser()
    for (let i = 0; i < POINTS; i++) {
      expect((await login('wrong')).status, `attempt ${i + 1}`).toBe(401)
    }

    const res = await login('wrong')
    expect(res.status).toBe(429)
    // blockDuration is 900s, past the window either way.
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(60)
  })

  it('blocks the correct password too once locked out', async () => {
    await setupUser()
    for (let i = 0; i < POINTS; i++) await login('wrong')

    // Otherwise an attacker gets unlimited guesses as long as they eventually hit.
    expect((await login('hashed')).status).toBe(429)
  })

  it('a successful login clears the failures behind it', async () => {
    await setupUser()
    for (let i = 0; i < POINTS - 1; i++) {
      expect((await login('wrong')).status).toBe(401)
    }

    expect((await login('hashed')).status).toBe(200)

    // Fresh budget, from a different IP so only the account limiter is in play.
    // Without the delete() the second of these would already be over the limit.
    for (let i = 0; i < POINTS; i++) {
      expect((await login('wrong', '198.51.100.60')).status, `post-reset ${i + 1}`).toBe(401)
    }
  })
})

describe('email normalisation', () => {
  it('buckets an address to one limiter key regardless of case or padding', () => {
    // Otherwise each capitalisation is its own counter and an attacker gets a
    // fresh budget per variant.
    expect(hashEmail('Sarah@Example.com ')).toBe(hashEmail('sarah@example.com'))
    expect(hashEmail('sarah@example.com')).not.toContain('@')
  })

  it('logs in an account registered with different casing', async () => {
    await postJson('/api/auth/register', {
      username: 'casey',
      email: 'Casey@Example.com',
      password: 'password123',
    })

    const res = await postJson('/api/auth/login', {
      email: 'casey@example.com',
      password: 'password123',
    })
    expect(res.status).toBe(200)
  })

  it('treats a case variant as the same account on signup', async () => {
    const first = await postJson('/api/auth/register', {
      username: 'dana',
      email: 'dana@example.com',
      password: 'password123',
    })
    expect(first.status).toBe(200)

    // Without normalising on write, this would create a second account for the
    // same real address and the unique constraint would never notice.
    const second = await postJson('/api/auth/register', {
      username: 'dana2',
      email: 'DANA@example.com',
      password: 'password123',
    })
    expect(second.status).toBe(409)
    expect(await second.json()).toMatchObject({ field: 'email' })
  })

  it('shares one rate limit bucket across case variants', async () => {
    await setupUser({ email: 'erin@example.com' })
    for (let i = 0; i < loginAccountLimiter.points; i++) {
      await postJson('/api/auth/login', { email: 'erin@example.com', password: 'wrong' })
    }

    const res = await postJson('/api/auth/login', { email: 'ERIN@example.com', password: 'wrong' })
    expect(res.status).toBe(429)
  })
})
