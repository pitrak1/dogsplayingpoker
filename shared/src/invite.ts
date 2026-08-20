import { z } from 'zod'
import { userSchema } from './user'

export const statusSchema = z.enum(['pending', 'accepted', 'declined'])
export type Status = z.infer<typeof statusSchema>

export const createInviteInputSchema = z.object({
  message: z.string().nullish(),
  receiverId: z.number().int().positive(),
})
export type CreateInviteInput = z.infer<typeof createInviteInputSchema>

export const chatInviteSchema = z.object({
  id: z.number().int().positive(),
  message: z.string().nullish(),
  receiverId: z.number().int().positive(),
  receiver: userSchema.nullish(),
  senderId: z.number().int().positive(),
  sender: userSchema.nullish(),
  createdAt: z.coerce.date(),
})

export type ChatInvite = z.infer<typeof chatInviteSchema>

export const invitePaginationResponseSchema = z.object({
  invites: z.array(chatInviteSchema),
  totalCount: z.number().int().nonnegative(),
})

export type InvitePaginationResponse = z.infer<typeof invitePaginationResponseSchema>
