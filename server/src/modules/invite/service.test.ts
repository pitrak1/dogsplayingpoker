import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/db'
import { users, chatInvites, chats, chatMemberships, messages } from '@/db/schema'
import * as inviteService from '@/modules/invite/service'
import { setupInvite, setupUsers } from '@/test/factories'

beforeEach(async () => {
  await db.delete(messages)
  await db.delete(chatMemberships)
  await db.delete(chats)
  await db.delete(chatInvites)
  await db.delete(users)
})

describe('inviteService.getSentInvitesForUser', () => {
  it('returns invites where user is sender', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id)
    const result = await inviteService.getSentInvitesForUser({ id: user1.id })
    expect(result.totalCount).toBe(1)
    expect(result.invites[0].receiverId).toBe(user2.id)
  })

  it('does not return invites where user is receiver', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user2.id, user1.id)
    const result = await inviteService.getSentInvitesForUser({ id: user1.id })
    expect(result.totalCount).toBe(0)
  })
})

describe('inviteService.getReceivedInvitesForUser', () => {
  it('returns invites where user is receiver', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id)
    const result = await inviteService.getReceivedInvitesForUser({ id: user2.id })
    expect(result.totalCount).toBe(1)
    expect(result.invites[0].senderId).toBe(user1.id)
  })

  it('does not return invites where user is sender', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user2.id, user1.id)
    const result = await inviteService.getReceivedInvitesForUser({ id: user2.id })
    expect(result.totalCount).toBe(0)
  })
})

describe('inviteService.getInviteById', () => {
  it('returns invite', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id)
    const result = await inviteService.getInviteById(invite.id)
    expect(result).not.toBeNull()
    expect(result!.senderId).toEqual(invite.senderId)
    expect(result!.receiverId).toEqual(invite.receiverId)
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

describe('inviteService.declineInvite', () => {
  it('updates status if invite exists', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
    const result = await inviteService.declineInvite(invite.id)
    expect(result).not.toBeNull()

    const rows = await db.select().from(chatInvites)
    expect(rows).toHaveLength(1)
    expect(rows[0].status).toBe('declined')
  })

  it('returns null if invite does not exist', async () => {
    const [user1, user2] = await setupUsers(2)
    await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
    const result = await inviteService.declineInvite(94)
    expect(result).toBeNull()
  })
})

describe('inviteService.acceptInvite', () => {
  it('updates status, creates chat, and adds users if invite exists', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
    const result = await inviteService.acceptInvite(invite.id)
    expect(result).not.toBeNull()

    const inviteRows = await db.select().from(chatInvites)
    expect(inviteRows).toHaveLength(1)
    expect(inviteRows[0].status).toBe('accepted')

    const chatRows = await db.select().from(chats)
    expect(chatRows).toHaveLength(1)
    expect(chatRows[0].id).toEqual(result!.id)

    const chatMembershipRows = await db.select().from(chatMemberships)
    expect(chatMembershipRows).toHaveLength(2)
    const membershipUserIds = chatMembershipRows.map(r => r.userId)

    expect(membershipUserIds[0]).toSatisfy(v => v === user1.id || v === user2.id)
    expect(membershipUserIds[1]).toSatisfy(v => v === user1.id || v === user2.id)
    expect(membershipUserIds[0]).not.toEqual(membershipUserIds[1])
  })

  it('creates message if message exists', async () => {
    const [user1, user2] = await setupUsers(2)
    const invite = await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
    const result = await inviteService.acceptInvite(invite.id)
    expect(result).not.toBeNull()

    const messageRows = await db.select().from(messages)
    expect(messageRows).toHaveLength(1)
    expect(messageRows[0].content).toBe('fake-message')
  })

  it('returns null if invite does not exist', async () => {
      const [user1, user2] = await setupUsers(2)
      await setupInvite(user1.id, user2.id, 'fake-message', 'pending')
      const result = await inviteService.acceptInvite(94)
      expect(result).toBeNull()
    })
})

describe('inviteService.createInvite', () => {
  it('creates invite', async () => {
    const [user1, user2] = await setupUsers(2)
    await inviteService.createInvite({ senderId: user1.id, receiverId: user2.id,  message: 'fake-message' })

    const rows = await db.select().from(chatInvites)
    expect(rows).toHaveLength(1)
    expect(rows[0].message).toBe('fake-message')
  })

  it('fails if sender does not exist', async () => {
    const [user1, user2] = await setupUsers(2)
    await expect(inviteService.createInvite({ senderId: 92, receiverId: user2.id,  message: 'fake-message' })).rejects.toThrow()
  })

  it('fails if receiver does not exist', async () => {
    const [user1, user2] = await setupUsers(2)
    await expect(inviteService.createInvite({ senderId: user1.id, receiverId: 92,  message: 'fake-message' })).rejects.toThrow()
  })
})
