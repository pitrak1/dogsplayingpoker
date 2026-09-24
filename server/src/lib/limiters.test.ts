import { describe, it, expect } from 'vitest'
import { redis, makeLimiter, makeBurstyLimiter } from '@/lib/limiters'
import { tryConsume } from '@/lib/rateLimit'

describe('limiter construction', () => {
  it('uses the Redis store in tests', () => {
    // Guards the dev/test split: if REDIS_URL stops reaching the limiters, every
    // test below still passes against the memory store and the Redis path — the
    // one production uses — silently stops being covered.
    expect(redis).not.toBeNull()
  })

  it('rejects once points are spent, and reports when to retry', async () => {
    const limiter = makeLimiter('test:basic', { points: 2, duration: 60 })
    expect(await tryConsume(limiter, 'k')).toEqual({ ok: true })
    expect(await tryConsume(limiter, 'k')).toEqual({ ok: true })

    const denied = await tryConsume(limiter, 'k')
    expect(denied.ok).toBe(false)
    if (!denied.ok) expect(denied.retryAfter).toBeGreaterThan(0)
  })

  it('counts each key separately', async () => {
    const limiter = makeLimiter('test:keys', { points: 1, duration: 60 })
    expect(await tryConsume(limiter, 'a')).toEqual({ ok: true })
    expect(await tryConsume(limiter, 'b')).toEqual({ ok: true })
    expect((await tryConsume(limiter, 'a')).ok).toBe(false)
  })

  it('delete() clears a key back to a full window', async () => {
    const limiter = makeLimiter('test:delete', { points: 1, duration: 60 })
    await tryConsume(limiter, 'k')
    expect((await tryConsume(limiter, 'k')).ok).toBe(false)

    await limiter.delete('k')
    expect(await tryConsume(limiter, 'k')).toEqual({ ok: true })
  })

  it('blockDuration outlasts the window it was breached in', async () => {
    const limiter = makeLimiter('test:block', { points: 1, duration: 1, blockDuration: 300 })
    await tryConsume(limiter, 'k')

    const denied = await tryConsume(limiter, 'k')
    expect(denied.ok).toBe(false)
    // Without blockDuration this would be <= 1s, since the window is one second.
    if (!denied.ok) expect(denied.retryAfter).toBeGreaterThan(100)
  })

  it('draws from the burst pool once the steady rate is spent', async () => {
    const limiter = makeBurstyLimiter(
      'test:bursty',
      { points: 1, duration: 60 },
      { points: 3, duration: 60 },
    )
    // 1 from steady + 3 from burst, then dry.
    for (let i = 0; i < 4; i++) {
      expect(await tryConsume(limiter, 'k'), `consume ${i + 1}`).toEqual({ ok: true })
    }
    expect((await tryConsume(limiter, 'k')).ok).toBe(false)
  })
})
