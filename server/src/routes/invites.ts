import { Hono } from 'hono'
import {
  getSentInvitesForUser,
  getReceivedInvitesForUser,
  getInviteById,
  updateInviteStatus,
  createInvite,
  getInviteBySenderAndReceiver
} from '@/modules/invite/service'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { createInviteInputSchema, updateInviteStatusInputSchema } from 'dogsplayingpoker-shared/invite'
import { paginationInputWithUserIdSchema } from '../types'

export const inviteRoutes = new Hono<AuthedEnv>()
  .get('/sent', zValidator('query', paginationInputWithUserIdSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    if (params.userId !== userId) return c.json({ message: 'You can only fetch your own invites' }, 400)
    const sent = await getSentInvitesForUser(params);
    return c.json(sent)
  })
  .get('/received', zValidator('query', paginationInputWithUserIdSchema), async (c) => {
    const userId = c.get('userId')
    const params = c.req.valid('query')
    if (params.userId !== userId) return c.json({ message: 'You can only fetch your own invites' }, 400)
    const received = await getReceivedInvitesForUser(params);
    return c.json(received)
  })
  .patch(
    '/',
    zValidator('json', updateInviteStatusInputSchema),
    async (c) => {
      const userId = c.get('userId')
      const input = c.req.valid('json')

      const invite = await getInviteById(input.id)
      if (!invite || invite.receiverId !== userId) return c.json({ message: 'Not found' }, 404)
      if (invite.status !== 'pending') return c.json({ message: 'Invite is already accepted or declined' }, 400)
      return c.json(await updateInviteStatus(input))
    }
  )
  .post(
    '/',
    zValidator('json', createInviteInputSchema),
    async (c) => {
      const userId = c.get('userId')
      const { receiverId, message } = c.req.valid('json')

      if (userId === receiverId) return c.json({ message: 'User cannot send an invite to themselves' }, 400)

      const existingInvite = await getInviteBySenderAndReceiver(userId, receiverId)
      if (existingInvite) return c.json({ message: 'User has already sent an invite' }, 400)

      const invite = await createInvite(userId, { receiverId, message })
      return c.json(invite, 201)
    }
  )
