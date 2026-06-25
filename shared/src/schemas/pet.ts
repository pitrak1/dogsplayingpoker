import { z } from 'zod'

export const reactivitySchema = z.enum(['none', 'mixed', 'strong', 'unknown'])
export type reactivity = z.infer<typeof reactivitySchema>

export const sizeSchema = z.enum(['toy', 'small', 'medium', 'large', 'giant', 'unknown'])
export type size = z.infer<typeof sizeSchema>

export const petSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  age: z.number().int().nonnegative(),
  size: sizeSchema,
  breed: z.string().min(1),
  pictureUrl: z.string().nullable(),
  ownerId: z.number().int().positive(),
  dogReactivity: reactivitySchema,
  dogReactivityNotes: z.string().nullable(),
  catReactivity: reactivitySchema,
  catReactivityNotes: z.string().nullable(),
  kidReactivity: reactivitySchema,
  kidReactivityNotes: z.string().nullable(),
  peopleReactivity: reactivitySchema,
  peopleReactivityNotes: z.string().nullable(),
})

export type Pet = z.infer<typeof petSchema>

export const createPetSchema = petSchema.omit({
  id: true,
  ownerId: true,
})

export type CreatePetInput = z.infer<typeof createPetSchema>
