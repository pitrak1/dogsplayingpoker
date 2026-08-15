import { z } from 'zod'
import { User } from './user'

export const createMessageInputSchema = z.object({
  content: z.string(),
})

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>

export const messageSchema = z.object({
  id: z.number().int().positive(),
  content: z.string(),
  chatId: z.number().int().positive(),
  createdBy: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish()
})

export type Message = z.infer<typeof messageSchema>

export type FullMessage = Message & {
  creator?: User | null
}

export type MessageGroup = {
  user: User
  createdAt: Date
  messages: FullMessage[]
}