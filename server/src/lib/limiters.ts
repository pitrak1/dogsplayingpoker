import Redis from 'ioredis'
import {
  BurstyRateLimiter,
  RateLimiterMemory,
  RateLimiterRedis,
} from 'rate-limiter-flexible'


export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { enableOfflineQueue: false })
  : null

export type Window = {
  points: number
  duration: number
  blockDuration?: number
}

export const makeLimiter = (keyPrefix: string, window: Window) =>
  redis
    ? new RateLimiterRedis({ storeClient: redis, keyPrefix, ...window })
    : new RateLimiterMemory({ keyPrefix, ...window })

export const makeBurstyLimiter = (keyPrefix: string, steady: Window, burst: Window) =>
  new BurstyRateLimiter(
    makeLimiter(`${keyPrefix}:steady`, steady),
    makeLimiter(`${keyPrefix}:burst`, burst),
  )

export const registerLimiter = makeLimiter('register', { points: 5, duration: 3600 })
export const loginIpLimiter = makeLimiter('login:ip', { points: 20, duration: 900 })
// The ratio is what caps a patient attacker: blockDuration only punishes bursting,
// so someone pacing just under a short window never trips it. At 5/60s that was
// ~236 guesses/hour against one account; at 10/3600s it's 10. Failing ten times in
// an hour on your own account is already unusual, and a success clears the key.
export const loginAccountLimiter = makeLimiter('login:account', {
  points: 10,
  duration: 3600,
  blockDuration: 900,
})
export const uploadLimiter = makeBurstyLimiter(
  'upload',
  { points: 1, duration: 120 },
  { points: 10, duration: 3600 },
)
export const inviteLimiter = makeLimiter('invite', { points: 10, duration: 3600 })
export const messageLimiter = makeBurstyLimiter(
  'message',
  { points: 1, duration: 2 },
  { points: 30, duration: 60 },
)
