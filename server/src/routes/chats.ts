import { Hono } from 'hono'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { idInputSchema, paginationInputSchema } from 'dogsplayingpoker-shared/common'
import { getChatsForUser, getChatMessages } from '@/services/chatService'
import * as chatService from '@/services/chatService'
import { createMessageInputSchema } from 'dogsplayingpoker-shared/message'
import { rateLimit, byUser } from '@/lib/rateLimit'
import { messageLimiter } from '@/lib/limiters'

export const chatRoutes = new Hono<AuthedEnv>()
  .get('/', zValidator('query', paginationInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    const sent = await getChatsForUser(userId, params);
    return c.json(sent)
  })
  .get('/:id', zValidator('param', idInputSchema), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('userId')
    const membership = await chatService.getChatMembership(userId, id)
    if (!membership) return c.json({ message: 'Not found' }, 404)
    const messages = await getChatMessages(id);
    return c.json(messages)
  })
  .post('/:id', rateLimit(messageLimiter, byUser), zValidator('param', idInputSchema), zValidator('json', createMessageInputSchema), async (c) => {
      const userId = c.get('userId')
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')

      const membership = await chatService.getChatMembership(userId, id)
      if (!membership) return c.json({ message: 'Forbidden' }, 403)

      const message = await chatService.createMessage(userId, id, input)
      return c.json(message, 201)
    })
