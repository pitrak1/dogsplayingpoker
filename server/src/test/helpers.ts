import { db } from '@/db'
import { messages, chatMemberships, chatInvites, userBlocks, pets, chats, users } from '@/db/schema'

export const resetDb = async () => {
  await db.delete(messages)
  await db.delete(chatMemberships)
  await db.delete(chatInvites)
  await db.delete(userBlocks)
  await db.delete(pets)
  await db.delete(chats)
  await db.delete(users)
}
