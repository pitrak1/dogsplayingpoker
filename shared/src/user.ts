import { z } from 'zod'
import { Pet } from './pet'
import { paginationInputSchema } from './common'

export const locationSchema = z.object({
  x: z.number(),
  y: z.number()
})

export type Location = z.infer<typeof locationSchema>

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.string().min(1),
  profileImageUrl: z.string().nullish(),
  location: locationSchema.nullish(),
  radiusMiles: z.number().int().positive().nullish()
})

export type User = z.infer<typeof userSchema>

export const createUserInputSchema = z.object({
  username: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  profileImageUrl: z.string().nullish(),
  location: locationSchema.nullish(),
  radiusMiles: z.number().int().positive().nullish()
})

export type CreateUserInput = z.infer<typeof createUserInputSchema>

export const editUserInputSchema = z.object({
  username: z.string().nullish(),
  profileImageUrl: z.string().nullish(),
  location: locationSchema.nullish(),
  radiusMiles: z.coerce.number().int().min(0).nullable().optional()
})

export type EditUserInput = z.infer<typeof editUserInputSchema>

export type FullUser = User & { pets: Pet[] }

export type AuthResponse = {
  authToken: string
  user: FullUser
}

export type UploadSignature = {
  timestamp: number
  signature: string
}


export const searchUsersInputSchema = z.intersection(
  z.object({
    swLat: z.coerce.number(),
    swLng: z.coerce.number(),
    neLat: z.coerce.number(),
    neLng: z.coerce.number(),
    centerLat: z.coerce.number(),
    centerLng: z.coerce.number(),
  }),
  paginationInputSchema
)

export type SearchUsersInput = z.infer<typeof searchUsersInputSchema>

export const usernameInputSchema = z.object({
  username: z.string()
})