import { and, eq, gt, sql, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { chatInvites, NewChatInvite, User, users, ChatInvite, chats, chatMemberships, messages } from '@/db/schema'
import { CreateInviteInput } from 'dogsplayingpoker-shared/invite'
import { add } from 'date-fns'
import { PaginationInputWithUserId, InviteWithUsers } from '@/types'
import { transformUser } from '@/lib/geo'


type InviteListResult = { invites: InviteWithUsers[], totalCount: number }

const attachUsersToInvites = async (invites: ChatInvite[], key: 'receiver' | 'sender') => {
  const userIds = invites.map(i => i[`${key}Id`])
  const allUsers = await db.select().from(users).where(inArray(users.id, userIds))

  const usersById = new Map<number, User>()
  for (const user of allUsers) {
    usersById.set(user.id, user)
  }

  return invites.map((row) => ({
    ...row,
    [key]: transformUser(usersById.get(row[`${key}Id`])!)
  }))
}

export const getSentInvitesForUser = async (input: PaginationInputWithUserId): Promise<InviteListResult> => {
  const { page, pageSize, userId } = input
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

  const invitesWithUsers = await attachUsersToInvites(invites, 'receiver')
  
  return { invites: invitesWithUsers, totalCount }
}

export const getReceivedInvitesForUser = async (input: PaginationInputWithUserId): Promise<InviteListResult> => {
  const { page, pageSize, userId } = input
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

  const invitesWithUsers = await attachUsersToInvites(invites, 'sender')
  
  return { invites: invitesWithUsers, totalCount }
}

export const getInviteById = async (id: number): Promise<ChatInvite | null> => {
  const rows = await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.id, id), 
      gt(chatInvites.expiredAt, sql`NOW()`),
    ))
  return rows[0] ?? null
}

export const getInviteBySenderAndReceiver = async (senderId: number, receiverId: number) => {
  const rows = await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.senderId, senderId),
      eq(chatInvites.receiverId, receiverId)
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

export const createInvite = async (input: CreateInviteInput) => {
  const expiredAt = add(new Date(), { weeks: 2 })
  const data = { status: 'pending', expiredAt, ...input } as NewChatInvite
  const rows = await db.insert(chatInvites).values(data).returning()
  return rows[0]
}
