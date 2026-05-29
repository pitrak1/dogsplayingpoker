import { describe, it, expect } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'

describe('GET /api/users/search', () => {
  it('returns 400 if required field is missing', async () => {
    // missing neLat
    const url = `/api/users/search?swLat=1&swLng=1&neLng=1&centerLat=1&centerLng=1`
    const res = await app.request(url)
    expect(res.status).toBe(400)
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
})