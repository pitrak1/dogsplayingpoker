import { createHmac } from 'node:crypto'
import { normalizeEmail } from './email'
import { createMiddleware } from 'hono/factory'
import { RateLimiterRes } from 'rate-limiter-flexible'
import type { Context, Env, MiddlewareHandler } from 'hono'

const monitorOnly = process.env.RATE_LIMIT_MODE === 'monitor'

export type Consumable = {
  consume(key: string, points?: number): Promise<unknown>
}

export type ConsumeResult = { ok: true } | { ok: false; retryAfter: number }

export const tryConsume = async (
  limiter: Consumable,
  key: string,
  points = 1,
): Promise<ConsumeResult> => {
  try {
    await limiter.consume(key, points)
    return { ok: true }
  } catch (e) {
    // Hitting the limit rejects with a RateLimiterRes; a broken store rejects with a
    // real Error. Conflating them would turn a Redis blip into a site-wide lockout.
    if (!(e instanceof RateLimiterRes)) throw e
    const retryAfter = Math.ceil(e.msBeforeNext / 1000)
    if (monitorOnly) {
      console.warn(`[rate-limit] would have blocked ${key} for ${retryAfter}s`)
      return { ok: true }
    }
    return { ok: false, retryAfter }
  }
}

export const rateLimit = <E extends Env>(
  limiter: Consumable,
  key: (c: Context<E>) => string,
  points = 1,
): MiddlewareHandler<E> =>
  createMiddleware<E>(async (c, next) => {
    const result = await tryConsume(limiter, key(c), points)
    if (!result.ok) {
      c.header('Retry-After', String(result.retryAfter))
      return c.json({ message: 'Too many requests' }, 429)
    }
    await next()
  })

type UserEnv = { Variables: { userId?: number } }

export const byUser = (c: Context<UserEnv>) => String(c.get('userId'))

export const byIp = (c: Context<Env>) =>
  c.req.header('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown'

// Keyed rather than a plain digest: emails are low-entropy, so a bare sha256 is
// reversible by dictionary in seconds. Without the secret, a Redis dump can't be
// tested against candidate addresses. Rotating it only orphans in-flight counters.
const keySecret = process.env.RATE_LIMIT_KEY_SECRET
if (!keySecret) throw new Error('RATE_LIMIT_KEY_SECRET is not set')

export const hashEmail = (email: string) =>
  createHmac('sha256', keySecret).update(normalizeEmail(email)).digest('hex').slice(0, 32)
