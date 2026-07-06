import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import { makePet } from '@/test/factories'
import * as petService from '@/modules/pet/service'

describe('GET /api/pets', () => {
  it('returns 400 if owner id is missing', async () => {
    const token = generateAuthToken(1)
    const res = await app.request('/api/pets', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/pets/:id', () => {
  it('returns 400 if id is not number', async () => {
    const token = generateAuthToken(1)
    const res = await app.request('/api/pets/asdf', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(400)
  })
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
})

describe('PUT /api/pets/:id', () => {
  it('returns 404 if pet does not exist', async () => {
    vi.spyOn(petService, 'getPetById').mockResolvedValue(null)
    const body = JSON.stringify(makePet(1, 1))
    const token = generateAuthToken(1)
    const res = await app.request(`/api/pets/11`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PUT',
      body,
    })
    expect(res.status).toBe(404)
  })

  it('returns 401 if pet does not belong to the user', async () => {
    const pet = makePet(1, 2)
    vi.spyOn(petService, 'getPetById').mockResolvedValue(pet)
    const body = JSON.stringify(pet)
    const token = generateAuthToken(1)
    const res = await app.request(`/api/pets/11`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PUT',
      body,
    })
    expect(res.status).toBe(403)
  })
})