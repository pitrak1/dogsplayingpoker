import { Hono } from 'hono'
import {
  getSentInvitesForUser,
  getReceivedInvitesForUser,
  getInviteById,
  acceptInvite,
  declineInvite,
  createInvite,
  getInviteBySenderAndReceiver
} from '@/modules/invite/service'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { createInviteInputSchema } from 'dogsplayingpoker-shared/invite'
import { paginationWithIdInputSchema } from 'dogsplayingpoker-shared/common'
import { idInputSchema } from 'dogsplayingpoker-shared/common'

export const inviteRoutes = new Hono<AuthedEnv>()
  .get('/sent', zValidator('query', paginationWithIdInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    if (params.id !== userId) return c.json({ message: 'You can only fetch your own invites' }, 400)
    const sent = await getSentInvitesForUser(params);
    return c.json(sent)
  })
  .get('/received', zValidator('query', paginationWithIdInputSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    if (params.id !== userId) return c.json({ message: 'You can only fetch your own invites' }, 400)
    const received = await getReceivedInvitesForUser(params);
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
    zValidator('json', createInviteInputSchema),
    async (c) => {
      const userId = c.get('userId')
      const { senderId, receiverId, message } = c.req.valid('json')

      if (userId === receiverId) return c.json({ message: 'User cannot send an invite to themselves' }, 400)

      const existingInvite = await getInviteBySenderAndReceiver(senderId, receiverId)
      if (existingInvite) return c.json({ message: 'User has already sent an invite' }, 400)

      const invite = await createInvite({ senderId, receiverId, message })
      return c.json(invite, 201)
    }
  )
