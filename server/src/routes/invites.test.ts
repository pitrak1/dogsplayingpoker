import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import { makeCreateInviteInput, makeInvite } from '@/test/factories'
import * as inviteService from '@/services/inviteService'
import { beforeEach } from 'vitest'
import { resetDb, schemaMismatch } from '@/test/helpers'
import { setupUsers, setupInvite } from '@/test/factories'
import { invitePaginationResponseSchema, chatInviteSchema } from 'dogsplayingpoker-shared/invite'
import { chatSchema } from 'dogsplayingpoker-shared/chat'

beforeEach(resetDb)

const authed = (userId: number) => ({
  Authorization: `Bearer ${generateAuthToken(userId)}`,
  'Content-Type': 'application/json',
})


describe('PATCH /api/invites/accept', () => {
  it('returns 404 if invite does not exist', async () => {
    vi.spyOn(inviteService, 'getInviteById').mockResolvedValue(null)
    const token = generateAuthToken(1)
    const body = JSON.stringify({ id: 1 })
    const res = await app.request(`/api/invites/accept`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body
    })
    expect(res.status).toBe(404)
  })

  it('returns 404 if receiver of invite is not authed user', async () => {
    vi.spyOn(inviteService, 'getInviteById').mockResolvedValue(makeInvite({ receiverId: 2 }))
    const token = generateAuthToken(1)
    const body = JSON.stringify({ id: 1 })
    const res = await app.request(`/api/invites/accept`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body
    })
    expect(res.status).toBe(404)
  })

  it('returns 400 if invite status is not pending', async () => {
    const foundInvite = makeInvite({ receiverId: 1 })
    foundInvite.status = 'accepted'
    vi.spyOn(inviteService, 'getInviteById').mockResolvedValue(foundInvite)
    const token = generateAuthToken(1)
    const body = JSON.stringify({ id: 3 })
    const res = await app.request(`/api/invites/accept`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body
    })
    expect(res.status).toBe(400)
  })

  it('response matches chatSchema', async () => {
    const [sender, receiver] = await setupUsers(2)
    const invite = await setupInvite(sender.id, receiver.id)
    const res = await app.request('/api/invites/accept', {
      method: 'PATCH',
      headers: authed(receiver.id),
      body: JSON.stringify({ id: invite.id }),
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, chatSchema)).toBeNull()
  })

})

describe('PATCH /api/invites/decline', () => {
  it('returns 404 if invite does not exist', async () => {
    vi.spyOn(inviteService, 'getInviteById').mockResolvedValue(null)
    const token = generateAuthToken(1)
    const body = JSON.stringify({ id: 1 })
    const res = await app.request(`/api/invites/decline`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body
    })
    expect(res.status).toBe(404)
  })

  it('returns 404 if receiver of invite is not authed user', async () => {
    vi.spyOn(inviteService, 'getInviteById').mockResolvedValue(makeInvite({ receiverId: 2 }))
    const token = generateAuthToken(1)
    const body = JSON.stringify({ id: 1 })
    const res = await app.request(`/api/invites/decline`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body
    })
    expect(res.status).toBe(404)
  })

  it('returns 400 if invite status is not pending', async () => {
    const foundInvite = makeInvite({ receiverId: 1 })
    foundInvite.status = 'declined'
    vi.spyOn(inviteService, 'getInviteById').mockResolvedValue(foundInvite)
    const token = generateAuthToken(1)
    const body = JSON.stringify({ id: 3 })
    const res = await app.request(`/api/invites/decline`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body
    })
    expect(res.status).toBe(400)
  })

  it('response matches chatInviteSchema', async () => {
    const [sender, receiver] = await setupUsers(2)
    const invite = await setupInvite(sender.id, receiver.id)
    const res = await app.request('/api/invites/decline', {
      method: 'PATCH',
      headers: authed(receiver.id),
      body: JSON.stringify({ id: invite.id }),
    })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, chatInviteSchema)).toBeNull()
  })

})

describe('POST /api/invites', () => {
  it('returns 400 if receiver is authed user', async () => {
    const token = generateAuthToken(1)
    const body = JSON.stringify(makeCreateInviteInput({ receiverId: 1 }))
    const res = await app.request(`/api/invites`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'POST',
      body
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 if invite between users already exists', async () => {
    const existingInvite = makeInvite({ receiverId: 2 })
    vi.spyOn(inviteService, 'getExistingInviteForUsers').mockResolvedValue(existingInvite)
    const token = generateAuthToken(1)
    const body = JSON.stringify(makeCreateInviteInput({ receiverId: 2 }))
    const res = await app.request(`/api/invites`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'POST',
      body
    })
    expect(res.status).toBe(400)
  })

  it('response matches chatInviteSchema', async () => {
    const [sender, receiver] = await setupUsers(2)
    const res = await app.request('/api/invites', {
      method: 'POST',
      headers: authed(sender.id),
      body: JSON.stringify({ receiverId: receiver.id, message: 'hello' }),
    })
    expect(res.status).toBe(201)
    expect(await schemaMismatch(res, chatInviteSchema)).toBeNull()
  })

})

describe('GET /api/invites/received', () => {
  it('response matches invitePaginationResponseSchema', async () => {
    const [sender, receiver] = await setupUsers(2)
    await setupInvite(sender.id, receiver.id)
    const res = await app.request('/api/invites/received', { headers: authed(receiver.id) })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, invitePaginationResponseSchema)).toBeNull()
  })
})

describe('GET /api/invites/sent', () => {
  it('response matches invitePaginationResponseSchema', async () => {
    const [sender, receiver] = await setupUsers(2)
    await setupInvite(sender.id, receiver.id)
    const res = await app.request('/api/invites/sent', { headers: authed(sender.id) })
    expect(res.status).toBe(200)
    expect(await schemaMismatch(res, invitePaginationResponseSchema)).toBeNull()
  })
})
