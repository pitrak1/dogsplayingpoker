import { describe, it, expect, vi } from 'vitest'
import { app } from '@/app'
import { generateAuthToken } from '@/lib/auth'
import { makeCreateInviteInput, makeInvite } from '@/test/factories'
import * as inviteService from '@/modules/invite/service'

describe('GET /api/invites/sent', () => {
  it('returns 400 if authenticated user is not requested user', async () => {
    const token = generateAuthToken(1)
    const res = await app.request(`/api/invites/sent?userId=${2}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/invites/received', () => {
  it('returns 400 if authenticated user is not requested user', async () => {
    const token = generateAuthToken(1)
    const res = await app.request(`/api/invites/received?userId=${2}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(400)
  })
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
})

describe('POST /api/invites', () => {
  it('returns 400 if receiver is authed user', async () => {
    const token = generateAuthToken(1)
    const body = JSON.stringify(makeCreateInviteInput({ senderId: 1, receiverId: 1 }))
    const res = await app.request(`/api/invites`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'POST',
      body
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 if invite between users already exists', async () => {
    const existingInvite = makeInvite({ senderId: 1, receiverId: 2 })
    vi.spyOn(inviteService, 'getInviteBySenderAndReceiver').mockResolvedValue(existingInvite)
    const token = generateAuthToken(1)
    const body = JSON.stringify(makeCreateInviteInput({ senderId: 1, receiverId: 2 }))
    const res = await app.request(`/api/invites`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      method: 'POST',
      body
    })
    expect(res.status).toBe(400)
  })
})