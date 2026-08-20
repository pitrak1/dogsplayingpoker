import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import { makePet, makePetInput } from '@/test/factories'
import * as petService from '@/services/petService'
import { beforeEach } from 'vitest'
import { z } from 'zod'
import { resetDb, schemaMismatch } from '@/test/helpers'
import { setupUser, setupPetForUser } from '@/test/factories'
import { petSchema } from 'dogsplayingpoker-shared/pet'

beforeEach(resetDb)

const authed = (userId: number) => ({
  Authorization: `Bearer ${generateAuthToken(userId)}`,
  'Content-Type': 'application/json',
})


describe('POST /api/pets/', () => {
  it('returns 400 if missing field', async () => {
    const noNameBody = JSON.stringify({
      age: 1,
      size: 'giant',
      breed: 'husky',
      dogReactivity: 'unknown',
      catReactivity: 'unknown',
      kidReactivity: 'unknown',
      peopleReactivity: 'unknown',
    })
    const token = generateAuthToken(1)
    const res = await app.request('/api/pets', {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'POST',
      body: noNameBody,
    })
    expect(res.status).toBe(400)
  })

  it('response matches petSchema', async () => {
    const user = await setupUser()
    const res = await app.request('/api/pets', {
      method: 'POST',
      headers: authed(user.id),
      body: JSON.stringify(makePetInput()),
    })
    expect(res.status).toBe(201)
    expect(await schemaMismatch(res, petSchema)).toBeNull()
  })

})

describe('PUT /api/pets/:id', () => {
  it('returns 404 if pet does not exist', async () => {
    vi.spyOn(petService, 'getPetById').mockResolvedValue(null)
    const body = JSON.stringify(makePetInput())
    const token = generateAuthToken(1)
    const res = await app.request(`/api/pets/11`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PUT',
      body,
    })
    expect(res.status).toBe(404)
  })

  it('returns 403 if pet does not belong to the user', async () => {
    const pet = makePet(1, 2)
    vi.spyOn(petService, 'getPetById').mockResolvedValue(pet)
    const body = JSON.stringify(makePetInput())
    const token = generateAuthToken(1)
    const res = await app.request(`/api/pets/11`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PUT',
      body,
    })
    expect(res.status).toBe(403)
  })

  it('response matches petSchema', async () => {
    const user = await setupUser()
    const pet = await setupPetForUser(user.id)
    const res = await app.request(`/api/pets/${pet.id}`, {
      method: 'PUT',
      headers: authed(user.id),
      body: JSON.stringify(makePetInput({ name: 'Renamed' })),
    })
    expect(res.status).toBe(201)
    expect(await schemaMismatch(res, petSchema)).toBeNull()
  })

})

describe('GET /api/pets', () => {
  it('response matches petSchema[]', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const res = await app.request('/api/pets', { headers: authed(user.id) })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, z.array(petSchema))).toBeNull()
  })
})
