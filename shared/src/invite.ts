import { z } from 'zod'
import { userSchema, User } from './user'

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
  createdAt: z.date(),
})

export type ChatInvite = z.infer<typeof chatInviteSchema>

export type FullChatInvite = ChatInvite & {
  sender?: User | null
  receiver?: User | null
}

export type InvitePaginationResponse = {
  invites: FullChatInvite[]
  totalCount: number
}
