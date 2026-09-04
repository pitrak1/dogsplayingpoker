import { describe, it, expect } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import { beforeEach } from 'vitest'
import { resetDb, schemaMismatch } from '@/test/helpers'
import { setupUser, setupPetForUser } from '@/test/factories'
import { fullUserSchema, paginatedUsersSchema, publicPaginatedUsersSchema } from 'dogsplayingpoker-shared/user'

beforeEach(resetDb)


describe('GET /api/users/search', () => {
  it('returns 400 if required field is missing', async () => {
    // missing neLat
    const url = `/api/users/search?swLat=1&swLng=1&neLng=1&centerLat=1&centerLng=1`
    const res = await app.request(url)
    expect(res.status).toBe(400)
  })

  it('response matches paginatedUsersSchema if authenticated', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const url = '/api/users/search?swLat=41&swLng=-88&neLat=42&neLng=-87&centerLat=41.8781&centerLng=-87.6298'
    const token = generateAuthToken(42)
    const res = await app.request(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, paginatedUsersSchema)).toBeNull()
  })

  it('response matches publicPaginatedUsersSchema if not authenticated', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const url = '/api/users/search?swLat=41&swLng=-88&neLat=42&neLng=-87&centerLat=41.8781&centerLng=-87.6298'
    const res = await app.request(url)
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, publicPaginatedUsersSchema)).toBeNull()
  })
})

describe('GET /api/users/by-username/:username', () => {
  it('returns 401 if not logged in', async () => {
    const res = await app.request(`/api/users/by-username/asdf`)
    expect(res.status).toBe(401)
  })

  it('returns 400 if username is not present', async () => {
    const token = generateAuthToken(42)
    const res = await app.request(`/api/users/by-username`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    expect(res.status).toBe(400)
  })

  it('response matches fullUserSchema', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const res = await app.request(`/api/users/by-username/${user.username}`, {
      headers: { Authorization: `Bearer ${generateAuthToken(user.id)}` },
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, fullUserSchema)).toBeNull()
  })

})

describe('GET /api/users/:id', () => {
  it('returns 401 if not logged in', async () => {
    const res = await app.request(`/api/users/asdf`)
    expect(res.status).toBe(401)
  })

  it('returns 400 if id is string', async () => {
    const token = generateAuthToken(42)
    const res = await app.request(`/api/users/asdf`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    expect(res.status).toBe(400)
  })

  it('response matches fullUserSchema', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const res = await app.request(`/api/users/${user.id}`, {
      headers: { Authorization: `Bearer ${generateAuthToken(user.id)}` },
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, fullUserSchema)).toBeNull()
  })
})

describe('GET /api/users/update-profile', () => {
  it('returns 401 if not logged in', async () => {
    const res = await app.request(`/api/users/update-profile`)
    expect(res.status).toBe(401)
  })

  it('response matches fullUserSchema with radiusMiles 0', async () => {
    const user = await setupUser()
    const res = await app.request('/api/users/update-profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${generateAuthToken(user.id)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: null, radiusMiles: 0 }),
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, fullUserSchema)).toBeNull()
  })

})
