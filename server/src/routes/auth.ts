import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as userService from '@/services/userService'
import { setRefreshCookie, getRefreshCookie } from '@/lib/auth'
import { AppEnv } from '../types'
import { AuthError, ConflictError } from '@/lib/errors'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})

export const authRoutes = new Hono<AppEnv>()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const body = c.req.valid('json')
    try {
      const { authToken, refreshToken, user } = await userService.loginUser(body.email, body.password)
      setRefreshCookie(c, refreshToken)
      return c.json({ authToken, user })
    } catch (e) {
      if (e instanceof AuthError) {
        return c.json({ message: e.message }, 401)
      }
      throw e
    }
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const body = c.req.valid('json')
    try {
      const { authToken, refreshToken, user } = await userService.createUser({
        username: body.username,
        email: body.email,
        password: body.password,
      })
      setRefreshCookie(c, refreshToken)
      return c.json({ authToken, user })
    } catch (e) {
      if (e instanceof ConflictError) {
        return c.json({ message: e.message, field: e.field }, 409)
      }
      throw e
    }
  })
  .post('/refresh', (c) => {
    const token = getRefreshCookie(c)
    if (!token) return c.json({ message: 'No refresh token' }, 401)
    try {
      const { authToken } = userService.refreshAccessToken(token)
      return c.json({ authToken })
    } catch {
      return c.json({ message: 'Invalid or expired refresh token' }, 401)
    }
  })