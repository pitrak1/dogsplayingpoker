import { ne, and, eq, sql, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { UserRow, users, chatMemberships } from '@/db/schema'
import { PaginationWithIdInput } from 'dogsplayingpoker-shared/common'
import { ChatMembership, ChatPaginationResponse } from 'dogsplayingpoker-shared/chat'

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

export const getChatsForUser = async (input: PaginationWithIdInput): Promise<ChatPaginationResponse> => {
  const { page, pageSize, id } = input
  const limit = pageSize ?? 10
  const offset = ((page ?? 1) - 1) * limit

  const [memberships, totalCount] = await Promise.all([
    db.select().from(chatMemberships)
      .where(eq(chatMemberships.userId, id)) 
      .orderBy(sql`created_at`)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(chatMemberships)
      .where(eq(chatMemberships.userId, id)) 
      .then(r => r[0].count)
  ])

  if (memberships.length === 0) return { chats: [], totalCount: 0 }

  const fullChats = await getFullChats(memberships, id)
  
  return { chats: fullChats, totalCount }
}