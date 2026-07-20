import { Hono } from 'hono'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { paginationWithIdInputSchema } from 'dogsplayingpoker-shared/common'
import { getChatsForUser } from '@/modules/chat/service'

export const chatRoutes = new Hono<AuthedEnv>()
  .get('/', zValidator('query', paginationWithIdInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    if (params.id !== userId) return c.json({ message: 'You can only fetch your own chats' }, 400)
    const sent = await getChatsForUser(params);
    return c.json(sent)
  })
