import { z } from 'zod'

export const statusSchema = z.enum(['pending', 'accepted', 'declined'])
export type status = z.infer<typeof statusSchema>

export const createInviteSchema = z.object({
  message: z.string().min(1).nullish(),
  receiverId: z.number().int().positive(),
})
export type CreateInviteInput = z.infer<typeof createInviteSchema>