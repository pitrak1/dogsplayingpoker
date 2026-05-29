import { describe, it, expect } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'

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