import { z } from 'zod'
import { userSchema } from './user'

export const statusSchema = z.enum(['pending', 'accepted', 'declined'])
export type status = z.infer<typeof statusSchema>

export const createInviteSchema = z.object({
  message: z.string().nullish(),
  receiverId: z.number().int().positive(),
})
export type CreateInviteInput = z.infer<typeof createInviteSchema>

export const inviteSchema = z.object({
  message: z.string().nullish(),
  receiver: userSchema.nullish(),
  sender: userSchema.nullish(),
  createdAt: z.date(),
})

export type Invite = z.infer<typeof inviteSchema>