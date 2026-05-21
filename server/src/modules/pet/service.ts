import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { pets, reactivityEnum, sizeEnum } from '@/db/schema'

export type Reactivity = (typeof reactivityEnum.enumValues)[number]
export type Size = (typeof sizeEnum.enumValues)[number]

export type CreatePetInput = {
  name: string
  age: number
  size: Size
  breed: string
  pictureUrl: string | null
  dogReactivity: Reactivity
  dogReactivityNotes: string | null
  catReactivity: Reactivity
  catReactivityNotes: string | null
  kidReactivity: Reactivity
  kidReactivityNotes: string | null
  peopleReactivity: Reactivity
  peopleReactivityNotes: string | null
}

export const listPetsForOwner = (ownerId: number) =>
  db.select().from(pets).where(eq(pets.ownerId, ownerId))

export const getPetById = async (id: number) => {
  const rows = await db.select().from(pets).where(eq(pets.id, id))
  return rows[0] ?? null
}

export const createPet = async (ownerId: number, input: CreatePetInput) => {
  const rows = await db.insert(pets).values({ ...input, ownerId }).returning()
  return rows[0]
}
