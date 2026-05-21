import { createMiddleware } from 'hono/factory'
import { verifyAuthToken } from '@/lib/auth'
import type { AppEnv } from '../types'

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header('authorization')
  const token = authHeader?.split(' ')[1]

  if (token) {
    try {
      const payload = verifyAuthToken(token)
      c.set('userId', payload.userId)
    } catch {
      // invalid / expired token — leave userId unset
    }
  }
  await next()
})

// Strict: bails out with 401 if userId isn't set. Use on protected routes
// (replaces the manual `if (!ctx.userId) throw ...` checks in your resolvers).
// Crucially, this narrows the type: `c.get('userId')` becomes `number` (not `number | undefined`).
export const requireAuth = createMiddleware<{
  Variables: { userId: number }
}>(async (c, next) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})