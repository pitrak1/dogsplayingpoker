import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import * as petService from '@/services/petService'
import type { AuthedEnv } from '../types'
import { createPetInputSchema } from 'dogsplayingpoker-shared/pet'
import { idInputSchema } from 'dogsplayingpoker-shared/common'

export const petRoutes = new Hono<AuthedEnv>()
  .get('/', zValidator('query', idInputSchema), async (c) => {
    const { id } = c.req.valid('query')
    return c.json(await petService.listPetsForOwner(id))
  })
  .get('/:id', zValidator('param', idInputSchema), async (c) => {
    const { id } = c.req.valid('param')
    const pet = await petService.getPetById(id)
    if (!pet) return c.json({ message: 'Not found' }, 404)
    return c.json(pet)
  })
  .post('/', zValidator('json', createPetInputSchema), async (c) => {
    const userId = c.get('userId')
    const input = c.req.valid('json')
    if (input.ownerId !== userId) return c.json({ message: 'Forbidden'}, 403)
    const pet = await petService.createPet(input)
    return c.json(pet, 201)
  })
  .put('/:id', zValidator('param', idInputSchema), zValidator('json', createPetInputSchema), async (c) => {
    const userId = c.get('userId')
    const { id } = c.req.valid('param')
    const input = c.req.valid('json')

    const existing = await petService.getPetById(id)
    if (!existing) return c.json({ message: 'Not found' }, 404)
    if (existing.ownerId !== userId) return c.json({ message: 'Forbidden' }, 403)

    const pet = await petService.editPet(id, input)
    return c.json(pet, 201)
  })
