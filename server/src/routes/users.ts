import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as userService from '@/services/userService'
import type { AppEnv } from '@/types'
import { requireAuth } from '@/middleware/auth'
import { editUserInputSchema, searchUserInputSchema, usernameInputSchema } from 'dogsplayingpoker-shared/user'
import { idInputSchema } from 'dogsplayingpoker-shared/common'

export const userRoutes = new Hono<AppEnv>()
  .get('/search', zValidator('query', searchUserInputSchema), async (c) => {
    const params = c.req.valid('query')
    const users = await userService.searchUsersNearby(params)
    return c.json(users)
  })
  .use(requireAuth)
  .get('/by-username/:username', zValidator('param', usernameInputSchema), async (c) => {
    const { username } = c.req.valid('param')
    const user = await userService.getUserByUsername(username)
    if (!user) return c.json({ message: 'Not found' }, 404)
    return c.json(user)
  })
  .get('/:id', zValidator('param', idInputSchema), async (c) => {
    const { id } = c.req.valid('param')
    const user = await userService.getFullUserById(id)
    if (!user) return c.json({ message: 'Not found' }, 404)
    return c.json(user)
  })
  .patch('/update-profile', zValidator('json', editUserInputSchema), async (c) => {
    const userId = c.get('userId')
    const body = c.req.valid('json')
    const updatedUser = await userService.updateUserProfile(userId, body)
    return c.json(updatedUser)
  })
