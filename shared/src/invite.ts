import { z } from 'zod'
import { userSchema, User } from './user'

export const statusSchema = z.enum(['pending', 'accepted', 'declined'])
export type Status = z.infer<typeof statusSchema>

export const createInviteInputSchema = z.object({
  message: z.string().nullish(),
  receiverId: z.number().int().positive(),
  senderId: z.number().int().positive(),
})
export type CreateInviteInput = z.infer<typeof createInviteInputSchema>

export const inviteSchema = z.object({
  message: z.string().nullish(),
  receiver: userSchema.nullish(),
  sender: userSchema.nullish(),
  createdAt: z.date(),
})

export type Invite = z.infer<typeof inviteSchema>

export type ChatInvite = {
  id: number
  message: string | null
  senderId: number
  receiverId: number
  status: Status
  createdAt: string
  updatedAt: string
  expiredAt: string
}

export type ChatInviteWithUsers = ChatInvite & {
  sender?: User | null
  receiver?: User | null
}

export type InviteListResponse = {
  invites: ChatInviteWithUsers[]
  totalCount: number
}
