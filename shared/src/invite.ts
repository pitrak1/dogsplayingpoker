import { z } from 'zod'
import { userSchema } from './user'

export const statusSchema = z.enum(['pending', 'accepted', 'declined'])
export type Status = z.infer<typeof statusSchema>

export const createChatInviteInputSchema = z.object({
  message: z.string().nullish(),
  receiverId: z.number().int().positive(),
})
export type CreateChatInviteInput = z.infer<typeof createChatInviteInputSchema>

export const chatInviteSchema = z.object({
  id: z.number().int().positive(),
  message: z.string().nullish(),
  receiverId: z.number().int().positive(),
  senderId: z.number().int().positive(),
  status: statusSchema,
  createdAt: z.coerce.date(),
})

export type ChatInvite = z.infer<typeof chatInviteSchema>

// The list endpoints attach whichever side of the invite the viewer isn't:
// received invites carry the sender, sent invites carry the receiver.
export const fullChatInviteSchema = chatInviteSchema.extend({
  receiver: userSchema.nullish(),
  sender: userSchema.nullish(),
})

export type FullChatInvite = z.infer<typeof fullChatInviteSchema>

export const paginatedChatInvitesSchema = z.object({
  invites: z.array(fullChatInviteSchema),
  totalCount: z.number().int().nonnegative(),
})

export type PaginatedChatInvites = z.infer<typeof paginatedChatInvitesSchema>
