import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/db'
import { users, chatInvites } from '@/db/schema'
import * as inviteService from '@/modules/invite/service'
import { setupInvite, setupUsers } from '@/test/factories'

beforeEach(async () => {
  await db.delete(chatInvites)
  await db.delete(users)
})

describe('inviteService.getSentInvitesForUser', () => {
  it('returns invites where user is sender', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id)
    const result = await inviteService.getSentInvitesForUser({ userId: user1.id })
    expect(result.totalCount).toBe(1)
    expect(result.invites[0].receiverId).toBe(user2.id)
  })

  it('does not return invites where user is receiver', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user2.id, user1.id)
    const result = await inviteService.getSentInvitesForUser({ userId: user1.id })
    expect(result.totalCount).toBe(0)
  })
})

describe('inviteService.getReceivedInvitesForUser', () => {
  it('returns invites where user is receiver', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id)
    const result = await inviteService.getReceivedInvitesForUser({ userId: user2.id })
    expect(result.totalCount).toBe(1)
    expect(result.invites[0].senderId).toBe(user1.id)
  })

  it('does not return invites where user is sender', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user2.id, user1.id)
    const result = await inviteService.getReceivedInvitesForUser({ userId: user2.id })
    expect(result.totalCount).toBe(0)
  })
})

describe('inviteService.getInviteById', () => {
  it('returns invite', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id)
    const result = await inviteService.getInviteById(invite.id)
    expect(result).not.toBeNull()
    expect(result.senderId).toEqual(invite.senderId)
    expect(result.receiverId).toEqual(invite.receiverId)
  })

  it('returns null if id does not exist', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id)
    const result = await inviteService.getInviteById(92)
    expect(result).toBeNull()
  })
})

describe('inviteService.getInviteBySenderAndReceiver', () => {
  it('returns invite', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id)
    const result = await inviteService.getInviteBySenderAndReceiver(user1.id, user2.id)
    expect(result).not.toBeNull()
    expect(result.senderId).toEqual(invite.senderId)
    expect(result.receiverId).toEqual(invite.receiverId)
  })

  it('returns null if sender and receiver are swapped', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id)
    const result = await inviteService.getInviteBySenderAndReceiver(user2.id, user1.id)
    expect(result).toBeNull()
  })
})

describe('inviteService.updateInviteStatus', () => {
  it('updates status if invite exists', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
    const result = await inviteService.updateInviteStatus({ id: invite.id, status: 'accepted' })
    expect(result).not.toBeNull()

    const rows = await db.select().from(chatInvites)
    expect(rows).toHaveLength(1)
    expect(rows[0].status).toBe('accepted')
  })

  it('returns null if pet does not exist', async () => {
      const [user1, user2] = await setupUsers(2)
      await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
      const result = await inviteService.updateInviteStatus({ id: 94, status: 'accepted' })
      expect(result).toBeNull()
    })
})

describe('inviteService.createInvite', () => {
  it('creates invite', async () => {
    const [user1, user2] = await setupUsers(2)
    await inviteService.createInvite(user1.id, { receiverId: user2.id,  message: 'fake-message' })

    const rows = await db.select().from(chatInvites)
    expect(rows).toHaveLength(1)
    expect(rows[0].message).toBe('fake-message')
  })

  it('fails if sender does not exist', async () => {
    const [user1, user2] = await setupUsers(2)
    await expect(inviteService.createInvite(92, { receiverId: user2.id,  message: 'fake-message' })).rejects.toThrow()
  })

  it('fails if receiver does not exist', async () => {
    const [user1, user2] = await setupUsers(2)
    await expect(inviteService.createInvite(user1.id, { receiverId: 92,  message: 'fake-message' })).rejects.toThrow()
  })
})
