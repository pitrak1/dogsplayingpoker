import { and, eq, lt, sql } from 'drizzle-orm'
import { db } from '@/db'
import { chatInvites, NewChatInvite } from '@/db/schema'
import { CreateInviteInput, status } from 'dogsplayingpoker-shared/schemas/invite'
import { add } from 'date-fns'

export const getSentInvitesForUser = async (userId: number) => {
  return await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.senderId, userId), 
      lt(chatInvites.expiredAt, sql`NOW()`)
    )) 
}

export const getReceivedInvitesForUser = async (id: number) => {
  return await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.receiverId, id),
      lt(chatInvites.expiredAt, sql`NOW()`),
      eq(chatInvites.status, "pending")
    ))
}

export const getInvite = async (id: number) => {
  const rows = await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.id, id), 
      lt(chatInvites.expiredAt, sql`NOW()`),
    ))
  return rows[0]
}

export const getInviteBySenderAndReceiver = async (senderId: number, receiverId: number) => {
  const rows = await db.select().from(chatInvites)
    .where(and(
      eq(chatInvites.senderId, senderId),
      eq(chatInvites.receiverId, receiverId)
    ))
  return rows[0]
}

export const updateInviteStatus = async (id: number, status: status) => {
  const rows = await db.update(chatInvites)
        .set({ status })
        .where(and(
          eq(chatInvites.id, id),
          lt(chatInvites.expiredAt, sql`NOW()`)
        ))
        .returning()
  // TODO: add lots of logic here for accepted invites
  // accepted invites should then trigger a creation of a chat with the invite message
  // as the first message
  return rows[0]
}

export const createInvite = async (senderId: number, input: CreateInviteInput) => {
  const expiredAt = add(new Date(), { weeks: 2 })
  const data = { senderId, status: 'pending', expiredAt, ...input } as NewChatInvite
  const rows = await db.insert(chatInvites).values(data).returning()
  return rows[0]
}
