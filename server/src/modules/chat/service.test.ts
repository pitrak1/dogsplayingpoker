import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/db'
import { users, chats, chatMemberships, messages, pets } from '@/db/schema'
import * as chatService from '@/modules/chat/service'
import { setupChat, setupChatMembership, setupUser, setupUsers, setupMessages, setupMessage } from '@/test/factories'

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

describe('chatService.getChatMembership', () => {
  it('returns chat membership for user by id', async () => {
    const user = await setupUser()
    const chat = await setupChat(user.id)
    await setupChatMembership(chat.id, user.id)
    const result = await chatService.getChatMembership(user.id, chat.id)
    expect(result).not.toBeNull()
    expect(result!.chatId).toBe(chat.id)
    expect(result!.userId).toBe(user.id)
  })

  it('returns null if not found', async () => {
    const user = await setupUser()
    const chat = await setupChat(user.id)
    await setupChatMembership(chat.id, user.id)
    const result = await chatService.getChatMembership(12, chat.id)
    expect(result).toBeNull()
  })
})

describe('chatService.getChatMessages', () => {
  it('returns messages for particular chat', async () => {
    const user = await setupUser()
    const chat1 = await setupChat(user.id)
    const chat2 = await setupChat(user.id)
    await setupChatMembership(chat1.id, user.id)
    await setupMessages(3, chat1.id, user.id)
    await setupMessages(4, chat2.id, user.id)
    const result = await chatService.getChatMessages(chat1.id)
    expect(result).not.toBeNull()
    expect(result.length).toBe(3)
  })

  it('attaches sending users', async () => {
    const [user1, user2] = await setupUsers(2)
    const chat = await setupChat(user1.id)
    await setupChatMembership(chat.id, user1.id)
    await setupChatMembership(chat.id, user2.id)
    await setupMessage(chat.id, user1.id)
    await setupMessage(chat.id, user2.id)
    const result = await chatService.getChatMessages(chat.id)
    expect(result).not.toBeNull()
    expect(result.length).toBe(2)
    expect(result[0].creator).not.toBeNull()
    expect(result[0].creator?.id).toBe(user1.id)
    expect(result[1].creator).not.toBeNull()
    expect(result[1].creator?.id).toBe(user2.id)
  })
})

describe('chatService.createMessage', () => {
  it('creates a message', async () => {
    const user = await setupUser()
    const chat = await setupChat(user.id)
    await setupChatMembership(chat.id, user.id)
    const message = await chatService.createMessage(user.id, chat.id, { content: 'some content here' })
    const rows = await db.select().from(messages)
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe(message.id)
  })

  it('fails if chat does not exist', async () => {
    const user = await setupUser()
    await expect(chatService.createMessage(user.id, 92, { content: 'fake content' })).rejects.toThrow()
  })

  it('fails if creator does not exist', async () => {
    const user = await setupUser()
    const chat = await setupChat(user.id)
    await expect(chatService.createMessage(56, chat.id, { content: 'fake content' })).rejects.toThrow()
  })
})
