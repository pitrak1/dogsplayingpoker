import { z } from 'zod'

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string().min(1),
  profileImageUrl: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  radiusMiles: z.number().int().positive().nullish()
})

export type User = z.infer<typeof userSchema>

export const editUserSchema = z.object({
  username: z.string().optional(),
  profileImageUrl: z.string().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  radiusMiles: z.coerce.number().int().min(0).nullable().optional()
})

export type EditUserInput = z.infer<typeof editUserSchema>