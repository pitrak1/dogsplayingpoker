import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as userService from '@/modules/user/service'
import type { AppEnv } from '../types'

const searchSchema = z.object({
  swLat: z.coerce.number(),
  swLng: z.coerce.number(),
  neLat: z.coerce.number(),
  neLng: z.coerce.number(),
  centerLat: z.coerce.number(),
  centerLng: z.coerce.number(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
})

export type SearchUsersParams = z.infer<typeof searchSchema>

export const userRoutes = new Hono<AppEnv>()
  .get('/', async (c) => {
    const userId = c.get('userId')
    if (!userId) return c.json({ message: 'Unauthorized' }, 401)
    return c.json(await userService.listUsers())
  })
  .get('/search', zValidator('query', searchSchema), async (c) => {
    const params = c.req.valid('query')
    const users = await userService.searchUsersNearby(params)
    return c.json(users)
  })
  .get('/by-username/:username', zValidator('param', z.object({ username: z.string() })), async (c) => {
    const { username } = c.req.valid('param')
    const user = await userService.getUserByUsername(username)
    if (!user) return c.json({ message: 'Not found' }, 404)
    return c.json(user)
  })
  .get('/:id', zValidator('param', z.object({ id: z.coerce.number().int() })), async (c) => {
    const { id } = c.req.valid('param')
    const user = await userService.getUserById(id)
    if (!user) return c.json({ message: 'Not found' }, 404)
    return c.json(user)
  })
