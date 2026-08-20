import { z } from 'zod'
import { userSchema, User } from './user'

export const createMessageInputSchema = z.object({
  content: z.string(),
})

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>

export const messageSchema = z.object({
  id: z.number().int().positive(),
  content: z.string(),
  chatId: z.number().int().positive(),
  createdBy: z.number().int().positive(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish()
})

export type Message = z.infer<typeof messageSchema>

export const fullMessageSchema = messageSchema.extend({
  creator: userSchema.nullish()
})

export type FullMessage = z.infer<typeof fullMessageSchema>

export type MessageGroup = {
  user: User
  createdAt: Date
  messages: FullMessage[]
}
