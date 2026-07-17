import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { pets, reactivityEnum, sizeEnum, NewPet, Pet } from '@/db/schema'
import { CreatePetInput } from 'dogsplayingpoker-shared/pet'

export type Reactivity = (typeof reactivityEnum.enumValues)[number]
export type Size = (typeof sizeEnum.enumValues)[number]

export const listPetsForOwner = (ownerId: number) =>
  db.select().from(pets).where(eq(pets.ownerId, ownerId))

export const getPetById = async (id: number): Promise<Pet | null> => {
  const [pet] = await db.select().from(pets).where(eq(pets.id, id)).limit(1)
  return pet ?? null
}

export const createPet = async (input: NewPet) => {
  const rows = await db.insert(pets).values(input).returning()
  return rows[0]
}

export const editPet = async (id: number, input: CreatePetInput): Promise<Pet | null> => {
  const [pet] = await db.update(pets).set(input).where(eq(pets.id, id)).returning()
  return pet ?? null
}
