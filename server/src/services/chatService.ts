import { ne, and, eq, sql, inArray, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { UserRow, users, chatMemberships, messages, NewMessageRow } from '@/db/schema'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { ChatMembership, ChatPaginationResponse } from 'dogsplayingpoker-shared/chat'
import { Message, FullMessage, CreateMessageInput } from 'dogsplayingpoker-shared/message'

const getFullChats = async (memberships: ChatMembership[], userId: number) => {
  const chatIds = memberships.map(m => m.chatId)
  const otherChatUsers = await db
    .select()
    .from(chatMemberships)
    .innerJoin(users, eq(chatMemberships.userId, users.id))
    .where(and(
      inArray(chatMemberships.chatId, chatIds),
      ne(chatMemberships.userId, userId)
    ))

  const otherUsersByChatId = new Map<number, UserRow>()
  for (const u of otherChatUsers) {
    otherUsersByChatId.set(u.chat_memberships.chatId, u.users)
  }

  return memberships.map(row => ({
    ...row, 
    otherUser: otherUsersByChatId.get(row.chatId)
  }))
}

const getFullMessages = async (m: Message[]) => {
  const messageIds = m.map(m => m.id)
  const messageUsers = await db
    .select()
    .from(users)
    .innerJoin(messages, eq(users.id, messages.createdBy))
    .where(and(
      inArray(messages.id, messageIds), 
      isNull(messages.deletedAt)
    ))

  const otherUsersByMessageId = new Map<number, UserRow>()
  for (const u of messageUsers) {
    otherUsersByMessageId.set(u.messages.id, u.users)
  }

  return m.map(row => ({
    ...row, 
    creator: otherUsersByMessageId.get(row.id)
  }))
}

export const getChatsForUser = async (userId: number, input: PaginationInput): Promise<ChatPaginationResponse> => {
  const { page, pageSize } = input
  const limit = pageSize ?? 10
  const offset = ((page ?? 1) - 1) * limit

  const [memberships, totalCount] = await Promise.all([
    db.select().from(chatMemberships)
      .where(eq(chatMemberships.userId, userId)) 
      .orderBy(sql`created_at`)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(chatMemberships)
      .where(eq(chatMemberships.userId, userId)) 
      .then(r => r[0].count)
  ])

  if (memberships.length === 0) return { chats: [], totalCount: 0 }

  const fullChats = await getFullChats(memberships, userId)
  
  return { chats: fullChats, totalCount }
}

export const getChatMembership = async (userId: number, chatId: number): Promise<ChatMembership | null> => {
  const rows = await db.select().from(chatMemberships)
    .where(and(
      eq(chatMemberships.userId, userId), 
      eq(chatMemberships.chatId, chatId),
      isNull(chatMemberships.deletedAt)
    ))
  return rows[0] ?? null
}

export const getChatMessages = async (chatId: number): Promise<FullMessage[]> => {
  const rows = await db.select().from(messages)
      .where(and(
        eq(messages.chatId, chatId),
        isNull(messages.deletedAt)
      ))
      .orderBy(sql`created_at`)
      .limit(50)
  return await getFullMessages(rows)
}

export const createMessage = async (userId: number, chatId: number, input: CreateMessageInput) => {
  const values = { ...input, createdBy: userId, chatId } as NewMessageRow
  const rows = await db.insert(messages).values(values).returning()
  return rows[0]
}

// export const getMembersForChat = async (chatId: number) => {
//   return await db.select().from(chatMemberships)
//     .innerJoin(users, eq(users.id, chatMemberships.userId))
//     .where(and(
//       eq(chatMemberships.chatId, chatId),
//       isNull(chatMemberships.deletedAt)
//     ))
// }