import { z } from 'zod'
import { petSchema } from './pet'
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

export const publicUserSchema = userSchema.pick({
  id: true,
  profileImageUrl: true,
  location: true,
  radiusMiles: true,
})

export type PublicUser = z.infer<typeof publicUserSchema>

export const createUserInputSchema = z.object({
  username: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(1),
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


export const searchUserInputSchema = z.intersection(
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

export type SearchUserInput = z.infer<typeof searchUserInputSchema>

export const usernameInputSchema = z.object({
  username: z.string()
})

export type UsernameInput = z.infer<typeof usernameInputSchema>

export const paginatedUsersSchema = z.object({
  users: z.array(fullUserSchema),
  totalCount: z.number().int().nonnegative(),
})

export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>

export const publicPaginatedUsersSchema = z.object({
  users: z.array(publicUserSchema),
  totalCount: z.number().int().nonnegative(),
})

export type PublicPaginatedUsers = z.infer<typeof publicPaginatedUsersSchema>

export type SearchUser = FullUser | PublicUser

export const isFullUser = (user: SearchUser): user is FullUser => 'username' in user