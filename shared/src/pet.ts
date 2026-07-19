import { z } from 'zod'

export const reactivitySchema = z.enum(['none', 'mixed', 'strong', 'unknown'])
export type Reactivity = z.infer<typeof reactivitySchema>

export const reactivityTypeSchema = z.enum(['Dogs', 'Cats', 'Kids', 'People'])
export type ReactivityType = z.infer<typeof reactivityTypeSchema>

export const displayReactivityMap: Record<Reactivity, string> = {
  unknown: 'Unknown',
  none: 'None',
  mixed: 'Mixed',
  strong: 'Strong',
}

export const sizeSchema = z.enum(['toy', 'small', 'medium', 'large', 'giant', 'unknown'])
export type size = z.infer<typeof sizeSchema>

export const displaySizeMap: Record<size, string> = {
  toy: 'Toy (0 - 10 lbs)',
  small: 'Small (10 - 35 lbs)',
  medium: 'Medium (35 - 55 lbs)',
  large: 'Large (55 - 85 lbs)',
  giant: 'Giant (85+ lbs)',
  unknown: 'Unknown size'
}

export const petSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  age: z.number().int().nonnegative(),
  size: sizeSchema,
  breed: z.string().min(1),
  pictureUrl: z.string().nullish(),
  ownerId: z.number().int().positive(),
  dogReactivity: reactivitySchema,
  dogReactivityNotes: z.string().nullish(),
  catReactivity: reactivitySchema,
  catReactivityNotes: z.string().nullish(),
  kidReactivity: reactivitySchema,
  kidReactivityNotes: z.string().nullish(),
  peopleReactivity: reactivitySchema,
  peopleReactivityNotes: z.string().nullish(),
})

export type Pet = z.infer<typeof petSchema>


export const createPetInputSchema = petSchema.omit({
  id: true,
})

export type CreatePetInput = z.infer<typeof createPetInputSchema>
