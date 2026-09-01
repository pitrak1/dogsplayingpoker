import { z } from 'zod'

export const apiErrorSchema = z.object({
  message: z.string(),
  field: z.string().optional(),
})
export type ApiErrorBody = z.infer<typeof apiErrorSchema>