import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as userService from '@/modules/user/service'
import { paginationInputSchema, type AppEnv } from '../types'
import { requireAuth } from '@/middleware/auth'
import { editUserSchema } from 'dogsplayingpoker-shared/schemas/user'

const searchSchema = z.intersection(
  z.object({
    swLat: z.coerce.number(),
    swLng: z.coerce.number(),
    neLat: z.coerce.number(),
    neLng: z.coerce.number(),
    centerLat: z.coerce.number(),
    centerLng: z.coerce.number(),
    page: z.coerce.number().int().min(1).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
  }),
  paginationInputSchema
)

export type SearchUsersParams = z.infer<typeof searchSchema>

export const userRoutes = new Hono<AppEnv>()
  .get('/search', zValidator('query', searchSchema), async (c) => {
    const params = c.req.valid('query')
    const users = await userService.searchUsersNearby(params)
    return c.json(users)
  })
  .use(requireAuth)
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
  .patch('/update-profile', zValidator('json', editUserSchema), async (c) => {
    const userId = c.get('userId')
    const body = c.req.valid('json')
    const updatedUser = await userService.updateUserProfile(userId, body)
    return c.json(updatedUser)
  })
