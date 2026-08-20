import { z } from 'zod'
import { userSchema } from './user'

export const chatSchema = z.object({
  id: z.number().int().positive(),
  hostId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish()
})

export type Chat = z.infer<typeof chatSchema>

export const chatMembershipSchema = z.object({
  userId: z.number().int().positive(),
  chatId: z.number().int().positive(),
})

export type ChatMembership = z.infer<typeof chatMembershipSchema>

export const fullChatMembershipSchema = z.intersection(
  chatMembershipSchema,
  z.object({ otherUser: userSchema.nullish() })
)

export type FullChatMembership = z.infer<typeof fullChatMembershipSchema>

export type ChatPaginationResponse = {
  chats: FullChatMembership[]
  totalCount: number
}