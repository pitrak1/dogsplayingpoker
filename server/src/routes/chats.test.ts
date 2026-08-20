import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import * as chatService from '@/services/chatService'
import { beforeEach } from 'vitest'
import { z } from 'zod'
import { resetDb, schemaMismatch } from '@/test/helpers'
import { setupUsers, setupChat, setupChatMembership, setupMessage } from '@/test/factories'
import { chatPaginationResponseSchema } from 'dogsplayingpoker-shared/chat'
import { fullMessageSchema } from 'dogsplayingpoker-shared/message'

beforeEach(resetDb)

const setupPair = async () => {
  const [me, them] = await setupUsers(2)
  const chat = await setupChat(me.id)
  await setupChatMembership(chat.id, me.id)
  await setupChatMembership(chat.id, them.id)
  return { me, them, chat }
}


describe('GET /api/chats/:id', () => {
  it('returns 404 if authenticated user does not have membership', async () => {
    vi.spyOn(chatService, 'getChatMembership').mockResolvedValue(null)
    const token = generateAuthToken(1)
    const res = await app.request(`/api/chats/4`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(404)
  })

  it('response matches fullMessageSchema[]', async () => {
    const { me, them, chat } = await setupPair()
    await setupMessage(chat.id, them.id)
    const res = await app.request(`/api/chats/${chat.id}`, {
      headers: { Authorization: `Bearer ${generateAuthToken(me.id)}` },
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, z.array(fullMessageSchema))).toBeNull()
  })

})

describe('POST /api/chats/:id', () => {
  it('returns 403 if authenticated user does not have membership', async () => {
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

describe('GET /api/chats', () => {
  it('response matches chatPaginationResponseSchema', async () => {
    const { me } = await setupPair()
    const res = await app.request('/api/chats', {
      headers: { Authorization: `Bearer ${generateAuthToken(me.id)}` },
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, chatPaginationResponseSchema)).toBeNull()
  })
})
