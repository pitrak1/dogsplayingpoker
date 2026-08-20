import { z } from 'zod'
import { Pet, petSchema } from './pet'
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
  radiusMiles: z.number().int().nonnegative().nullish()
})

export type User = z.infer<typeof userSchema>

export const userRowSchema = z.intersection(
  userSchema,
  z.object({
    password: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullish()
  })
)

export type UserRow = z.infer<typeof userRowSchema>

export type FullUserRow = UserRow & { pets: Pet[] }

export const createUserInputSchema = z.object({
  username: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
  profileImageUrl: z.string().nullish(),
  location: locationSchema.nullish(),
  radiusMiles: z.number().int().nonnegative().nullish()
})

export type CreateUserInput = z.infer<typeof createUserInputSchema>

export const editUserInputSchema = z.object({
  username: z.string().nullish(),
  profileImageUrl: z.string().nullish(),
  location: locationSchema.nullish(),
  radiusMiles: z.coerce.number().int().nonnegative().nullish()
})

export type EditUserInput = z.infer<typeof editUserInputSchema>

export const fullUserSchema = userSchema.extend({
  pets: z.array(petSchema)
})

export type FullUser = z.infer<typeof fullUserSchema>

export const authResponseSchema = z.object({
  authToken: z.string().min(1),
  user: fullUserSchema,
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export const uploadSignatureSchema = z.object({
  timestamp: z.number(),
  signature: z.string(),
})

export type UploadSignature = z.infer<typeof uploadSignatureSchema>


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

export const userPaginationResponseSchema = z.object({
  users: z.array(fullUserSchema),
  totalCount: z.number().int().nonnegative(),
})

export type UserPaginationResponse = z.infer<typeof userPaginationResponseSchema>