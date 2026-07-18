import { z } from 'zod'

export const idInputSchema = z.object({
  id: z.number().int().positive()
})
export type IdInput = z.infer<typeof idInputSchema>
