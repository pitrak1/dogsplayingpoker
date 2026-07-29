import { and, eq, gt, sql, inArray, or } from 'drizzle-orm'
import { db } from '@/db'
import { chatInvites, NewChatInviteRow, UserRow, users, ChatInviteRow, chats, chatMemberships, messages } from '@/db/schema'
import { CreateInviteInput, InvitePaginationResponse, ChatInvite } from 'dogsplayingpoker-shared/invite'
import { PaginationInput } from 'dogsplayingpoker-shared/common'
import { add } from 'date-fns'

const getFullInvites = async (invites: ChatInvite[], key: 'receiver' | 'sender') => {
  const userIds = invites.map(i => i[`${key}Id`])
  const allUsers = await db.select().from(users).where(inArray(users.id, userIds))

  const usersById = new Map<number, UserRow>()
  for (const user of allUsers) {
    usersById.set(user.id, user)
  }

  return invites.map((row) => ({
    ...row,
    [key]: usersById.get(row[`${key}Id`])!
  }))
}

export const getSentInvitesForUser = async (userId: number, input: PaginationInput): Promise<InvitePaginationResponse> => {
  const { page, pageSize } = input
  const limit = pageSize ?? 10
  const offset = ((page ?? 1) - 1) * limit

  const [invites, totalCount] = await Promise.all([
    db.select().from(chatInvites)
      .where(and(
        eq(chatInvites.senderId, userId), 
        gt(chatInvites.expiredAt, sql`NOW()`)
      )) 
      .orderBy(sql`created_at`)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(chatInvites)
      .where(and(
        eq(chatInvites.senderId, userId),
        gt(chatInvites.expiredAt, sql`NOW()`)
      ))
      .then(r => r[0].count)
  ])

  if (invites.length === 0) return { invites: [], totalCount: 0 }

  const fullInvites = await getFullInvites(invites, 'receiver')
  
  return { invites: fullInvites, totalCount }
}

export const getReceivedInvitesForUser = async (userId: number, input: PaginationInput): Promise<InvitePaginationResponse> => {
  const { page, pageSize } = input
  const limit = pageSize ?? 10
  const offset = ((page ?? 1) - 1) * limit

  const [invites, totalCount] = await Promise.all([
    db.select().from(chatInvites)
      .where(and(
        eq(chatInvites.receiverId, userId),
        gt(chatInvites.expiredAt, sql`NOW()`),
        eq(chatInvites.status, "pending")
      ))
      .orderBy(sql`created_at`)
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(chatInvites)
      .where(and(
        eq(chatInvites.receiverId, userId),
        gt(chatInvites.expiredAt, sql`NOW()`),
        eq(chatInvites.status, "pending")
      ))
      .then(r => r[0].count)
  ])
  
  if (invites.length === 0) return { invites: [], totalCount: 0 }

  const fullInvites = await getFullInvites(invites, 'sender')
  
  return { invites: fullInvites, totalCount }
}

export const getInviteById = async (id: number): Promise<ChatInviteRow | null> => {
  const rows = await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.id, id), 
      gt(chatInvites.expiredAt, sql`NOW()`),
    ))
  return rows[0] ?? null
}

export const getExistingInviteForUsers = async (user1Id: number, user2Id: number) => {
  const rows = await db.select().from(chatInvites)
    .where(or(
      and(eq(chatInvites.senderId, user1Id), eq(chatInvites.receiverId, user2Id)),
      and(eq(chatInvites.senderId, user2Id), eq(chatInvites.receiverId, user1Id))
    ))
  return rows[0] ?? null
}

export const declineInvite = async (id: number) => {
  const rows = await db.update(chatInvites)
    .set({ status: 'declined' })
    .where(and(
      eq(chatInvites.id, id),
      gt(chatInvites.expiredAt, sql`NOW()`)
    ))
    .returning()
  return rows[0] ?? null
}

export const acceptInvite = async (id: number) => {
  return await db.transaction(async (tx) => {
    const inviteRows = await tx.update(chatInvites)
      .set({ status: 'accepted' })
      .where(and(
        eq(chatInvites.id, id),
        gt(chatInvites.expiredAt, sql`NOW()`)
      ))
      .returning()
    const invite = inviteRows[0] ?? null
    if (!invite) return null
    const chatRows = await tx.insert(chats).values({ hostId: invite.senderId }).returning()
    const chat = chatRows[0] ?? null
    await tx.insert(chatMemberships).values({ chatId: chat.id, userId: invite.senderId })
    await tx.insert(chatMemberships).values({ chatId: chat.id, userId: invite.receiverId })
    if (invite.message) {
      await tx.insert(messages).values({ chatId: chat.id, content: invite.message, createdBy: invite.senderId })
    }
    return chat
  })
}

export const createInvite = async (userId: number, input: CreateInviteInput) => {
  const expiredAt = add(new Date(), { weeks: 2 })
  const data = { status: 'pending', expiredAt, senderId: userId, ...input } as NewChatInviteRow
  const rows = await db.insert(chatInvites).values(data).returning()
  return rows[0]
}
