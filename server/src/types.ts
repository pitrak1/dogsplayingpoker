import { User, Pet, ChatInvite } from '@/db/schema'
import { z } from 'zod'

export type AppEnv = {
  Variables: {
    userId?: number
  }
}

export type AuthedEnv = {
  Variables: {
    userId: number
  }
}

export type UserWithCoords = Omit<User, 'location'> & {
  latitude: number | null
  longitude: number | null
}

export type UserWithPets = UserWithCoords & {
  pets: Pet[]
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'location'> & {
  latitude: number | null
  longitude: number | null
}

export type CreatePetInput = Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export const paginationInputSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
})

export type PaginationInput = z.infer<typeof paginationInputSchema>

export const paginationInputWithUserIdSchema = z.intersection(
  paginationInputSchema,
  z.object({ userId: z.coerce.number().int() })
)

export type PaginationInputWithUserId = z.infer<typeof paginationInputWithUserIdSchema>

export type InviteWithUsers = ChatInvite & {
  sender?: UserWithCoords | null
  receiver?: UserWithCoords | null
}
