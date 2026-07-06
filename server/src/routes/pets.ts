import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as petService from '@/modules/pet/service'
import type { AuthedEnv } from '../types'
import { createPetSchema } from 'dogsplayingpoker-shared/schemas/pet'
import { NewPet } from '@/db/schema'

const listQuerySchema = z.object({
  ownerId: z.coerce.number().int(),
})

const idParamSchema = z.object({
  id: z.coerce.number().int(),
})

export const petRoutes = new Hono<AuthedEnv>()
  .get('/', zValidator('query', listQuerySchema), async (c) => {
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
    const input = c.req.valid('json')

    const newPet: NewPet = {
      ...input,
      ownerId: userId
    }
    const pet = await petService.createPet(newPet)
    return c.json(pet, 201)
  })
  .put('/:id', zValidator('param', idParamSchema), zValidator('json', createPetSchema), async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.valid('param')
    const input = c.req.valid('json')

    const existing = await petService.getPetById(id)
    if (!existing) return c.json({ message: 'Not found' }, 404)
    if (existing.ownerId !== userId) return c.json({ message: 'Forbidden' }, 403)

    const pet = await petService.editPet(id, input)
    return c.json(pet, 201)
  })
