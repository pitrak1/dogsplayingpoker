import { User, Pet } from '@/db/schema'

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

export type CreatePetInput = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>

