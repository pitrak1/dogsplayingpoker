import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as petService from '@/modules/pet/service'
import type { AppEnv } from '../types'

const reactivitySchema = z.enum(['strong', 'mixed', 'none', 'unknown'])
const sizeSchema = z.enum(['giant', 'large', 'medium', 'small', 'toy', 'unknown'])

const createPetSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().nonnegative(),
  size: sizeSchema,
  breed: z.string().min(1),
  pictureUrl: z.string().nullable().optional(),
  dogReactivity: reactivitySchema,
  dogReactivityNotes: z.string().nullable().optional(),
  catReactivity: reactivitySchema,
  catReactivityNotes: z.string().nullable().optional(),
  kidReactivity: reactivitySchema,
  kidReactivityNotes: z.string().nullable().optional(),
  peopleReactivity: reactivitySchema,
  peopleReactivityNotes: z.string().nullable().optional(),
})

const listQuerySchema = z.object({
  ownerId: z.coerce.number().int(),
})

const idParamSchema = z.object({
  id: z.coerce.number().int(),
})

export const petRoutes = new Hono<AppEnv>()
  .get('/', zValidator('query', listQuerySchema), async (c) => {
    if (!c.get('userId')) return c.json({ message: 'Unauthorized' }, 401)
    const { ownerId } = c.req.valid('query')
    return c.json(await petService.listPetsForOwner(ownerId))
  })
  .get('/:id', zValidator('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param')
    const pet = await petService.getPetById(id)
    if (!pet) return c.json({ message: 'Not found' }, 404)
    return c.json(pet)
  })
  .post('/', zValidator('json', createPetSchema), async (c) => {
    const userId = c.get('userId')
    if (!userId) return c.json({ message: 'Unauthorized' }, 401)
    const body = c.req.valid('json')
    const pet = await petService.createPet(userId, {
      name: body.name,
      age: body.age,
      size: body.size,
      breed: body.breed,
      pictureUrl: body.pictureUrl ?? null,
      dogReactivity: body.dogReactivity,
      dogReactivityNotes: body.dogReactivityNotes ?? null,
      catReactivity: body.catReactivity,
      catReactivityNotes: body.catReactivityNotes ?? null,
      kidReactivity: body.kidReactivity,
      kidReactivityNotes: body.kidReactivityNotes ?? null,
      peopleReactivity: body.peopleReactivity,
      peopleReactivityNotes: body.peopleReactivityNotes ?? null,
    })
    return c.json(pet, 201)
  })
