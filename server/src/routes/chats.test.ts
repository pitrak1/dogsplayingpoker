import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import { makeChatMembership } from '@/test/factories'
import * as chatService from '@/services/chatService'

describe('GET /api/chats', () => {
  it('returns 400 if authenticated user is not requested user', async () => {
    const token = generateAuthToken(1)
    const res = await app.request(`/api/chats?userId=${2}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/chats/:id', () => {
  it('returns 404 if authenticated user does not have membership', async () => {
    vi.spyOn(chatService, 'getChatMembership').mockResolvedValue(null)
    const token = generateAuthToken(1)
    const res = await app.request(`/api/chats/4`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(404)
  })
})

describe('POST /api/chats/:id', () => {
  it('returns 404 if authenticated user does not have membership', async () => {
    vi.spyOn(chatService, 'getChatMembership').mockResolvedValue(null)
    const token = generateAuthToken(1)
    const body = JSON.stringify({ content: 'fake content' })
    const res = await app.request(`/api/chats/4`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'POST',
      body
    })
    expect(res.status).toBe(403)
  })
})