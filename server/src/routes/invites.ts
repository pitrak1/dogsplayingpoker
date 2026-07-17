import { Hono } from 'hono'
import {
  getSentInvitesForUser,
  getReceivedInvitesForUser,
  getInvite,
  updateInviteStatus,
  createInvite,
  getInviteBySenderAndReceiver
} from '@/modules/invite/service'
import type { AuthedEnv } from '../types'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { createInviteSchema } from 'dogsplayingpoker-shared/invite'
import { paginationInputWithUserIdSchema } from '../types'

const idParamSchema = z.object({
  id: z.coerce.number().int(),
})

const statusJsonSchema = z.object({
  status: z.union([z.literal('accepted'), z.literal('declined')])
})

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
    '/:id',
    zValidator('param', idParamSchema),
    zValidator('json', statusJsonSchema),
    async (c) => {
      const userId = c.get('userId')
      const { id } = c.req.valid('param')
      const { status } = c.req.valid('json')

      const invite = await getInvite(id)
      if (!invite || invite.receiverId !== userId) return c.json({ message: 'Not found' }, 404)
      if (invite.status !== 'pending') return c.json({ message: 'Invite is already accepted or declined' }, 400)
      return c.json(await updateInviteStatus(id, status))
    }
  )
  .post(
    '/',
    zValidator('json', createInviteSchema),
    async (c) => {
      const userId = c.get('userId')
      const input = c.req.valid('json')

      if (userId === input.receiverId) return c.json({ message: 'User cannot send an invite to themselves' }, 400)

      const existingInvite = await getInviteBySenderAndReceiver(userId, input.receiverId)
      if (existingInvite) return c.json({ message: 'User has already sent an invite' }, 400)

      const invite = await createInvite(userId, input)
      return c.json(invite, 201)
    }
  )
