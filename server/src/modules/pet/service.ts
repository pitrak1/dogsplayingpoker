import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { pets, reactivityEnum, sizeEnum, NewPet } from '@/db/schema'

export type Reactivity = (typeof reactivityEnum.enumValues)[number]
export type Size = (typeof sizeEnum.enumValues)[number]

export const listPetsForOwner = (ownerId: number) =>
  db.select().from(pets).where(eq(pets.ownerId, ownerId))

export const getPetById = async (id: number) => {
  const rows = await db.select().from(pets).where(eq(pets.id, id))
  return rows[0] ?? null
}

export const createPet = async (input: NewPet) => {
  const rows = await db.insert(pets).values(input).returning()
  return rows[0]
}
