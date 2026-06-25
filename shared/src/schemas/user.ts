import { z } from 'zod'

export const editUserSchema = z.object({
  username: z.string().optional(),
  profileImageUrl: z.string().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  radiusMiles: z.coerce.number().int().min(0).nullable().optional()
})

export type EditUserInput = z.infer<typeof editUserSchema>