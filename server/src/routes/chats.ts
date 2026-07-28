import { Hono } from 'hono'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { idInputSchema, paginationWithIdInputSchema } from 'dogsplayingpoker-shared/common'
import { getChatsForUser, getChatMessages } from '@/modules/chat/service'
import * as chatService from '@/modules/chat/service'
import { createMessageInputSchema } from 'dogsplayingpoker-shared/message'

export const chatRoutes = new Hono<AuthedEnv>()
  .get('/', zValidator('query', paginationWithIdInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    if (params.id !== userId) return c.json({ message: 'You can only fetch your own chats' }, 400)
    const sent = await getChatsForUser(params);
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
  .post('/:id', zValidator('param', idInputSchema), zValidator('json', createMessageInputSchema), async (c) => {
      const userId = c.get('userId')
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')

      const membership = await chatService.getChatMembership(userId, id)
      if (!membership) return c.json({ message: 'Forbidden' }, 403)

      const message = await chatService.createMessage(userId, id, input)
      return c.json(message, 201)
    })
