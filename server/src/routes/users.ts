import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as userService from '@/modules/user/service'
import type { AppEnv } from '../types'

export const userRoutes = new Hono<AppEnv>()
  .get('/', async (c) => {
    const userId = c.get('userId')
    if (!userId) return c.json({ message: 'Unauthorized' }, 401)
    return c.json(await userService.listUsers())
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