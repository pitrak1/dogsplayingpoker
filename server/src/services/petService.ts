import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { pets } from '@/db/schema'
import { CreatePetInput, Pet } from 'dogsplayingpoker-shared/pet'

export const listPetsForOwner = (ownerId: number) =>
  db.select().from(pets).where(eq(pets.ownerId, ownerId))

export const getPetById = async (id: number): Promise<Pet | null> => {
  const [pet] = await db.select().from(pets).where(eq(pets.id, id)).limit(1)
  return pet ?? null
}

export const createPet = async (userId: number, input: CreatePetInput) => {
  const rows = await db.insert(pets).values({ ownerId: userId, ...input }).returning()
  return rows[0]
}

// CreatePetInput is fine to use here because the current form sends back all form data, not just changes
export const editPet = async (id: number, userId: number, input: CreatePetInput): Promise<Pet | null> => {
  const [pet] = await db.update(pets).set({ ownerId: userId, ...input }).where(eq(pets.id, id)).returning()
  return pet ?? null
}
