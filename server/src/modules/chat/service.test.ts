import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/db'
import { users, chats, chatMemberships, messages, pets } from '@/db/schema'
import * as chatService from '@/modules/chat/service'
import { setupChat, setupChatMembership, setupUser, setupUsers } from '@/test/factories'

beforeEach(async () => {
  await db.delete(messages)
  await db.delete(chatMemberships)
  await db.delete(chats)
  await db.delete(pets)
  await db.delete(users)
})

describe('chatService.getChatsForUser', () => {
  it('returns chat memberships for user', async () => {
    const user = await setupUser()
    const chat = await setupChat(user.id)
    await setupChatMembership(chat.id, user.id)
    const result = await chatService.getChatsForUser({ id: user.id })
    expect(result.totalCount).toBe(1)
    expect(result.chats[0].chatId).toBe(chat.id)
  })

  it('returns other user if has membership', async () => {
    const [user1, user2] = await setupUsers(2)
    const chat = await setupChat(user1.id)
    await setupChatMembership(chat.id, user1.id)
    await setupChatMembership(chat.id, user2.id)
    const result = await chatService.getChatsForUser({ id: user1.id })
    expect(result.totalCount).toBe(1)
    expect(result.chats[0].otherUser).not.toBeNull()
    expect(result.chats[0].otherUser?.username).toBe(user2.username)
  })
})
