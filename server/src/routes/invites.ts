import { Hono } from 'hono'
import {
  getSentInvitesForUser,
  getReceivedInvitesForUser,
  getInviteById,
  acceptInvite,
  declineInvite,
  createInvite,
  getExistingInviteForUsers
} from '@/services/inviteService'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { createChatInviteInputSchema } from 'dogsplayingpoker-shared/invite'
import { paginationInputSchema } from 'dogsplayingpoker-shared/common'
import { idInputSchema } from 'dogsplayingpoker-shared/common'

export const inviteRoutes = new Hono<AuthedEnv>()
  .get('/sent', zValidator('query', paginationInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    const sent = await getSentInvitesForUser(userId, params);
    return c.json(sent)
  })
  .get('/received', zValidator('query', paginationInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    const received = await getReceivedInvitesForUser(userId, params);
    return c.json(received)
  })
  .patch(
    '/accept',
    zValidator('json', idInputSchema),
    async (c) => {
      const userId = c.get('userId')
      const { id } = c.req.valid('json')

      const invite = await getInviteById(id)
      if (!invite || invite.receiverId !== userId) return c.json({ message: 'Not found' }, 404)
      if (invite.status !== 'pending') return c.json({ message: 'Invite is already accepted or declined' }, 400)
      return c.json(await acceptInvite(id))
    }
  )
  .patch(
    '/decline',
    zValidator('json', idInputSchema),
    async (c) => {
      const userId = c.get('userId')
      const { id } = c.req.valid('json')

      const invite = await getInviteById(id)
      if (!invite || invite.receiverId !== userId) return c.json({ message: 'Not found' }, 404)
      if (invite.status !== 'pending') return c.json({ message: 'Invite is already accepted or declined' }, 400)
      return c.json(await declineInvite(id))
    }
  )
  .post(
    '/',
    zValidator('json', createChatInviteInputSchema),
    async (c) => {
      const userId = c.get('userId')
      const { receiverId, message } = c.req.valid('json')

      if (userId === receiverId) return c.json({ message: 'User cannot send an invite to themselves' }, 400)

      const existingInvite = await getExistingInviteForUsers(userId, receiverId)
      if (existingInvite) return c.json({ message: 'Invite already exists between users' }, 400)

      const invite = await createInvite(userId, { receiverId, message })
      return c.json(invite, 201)
    }
  )
