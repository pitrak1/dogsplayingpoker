import { z } from 'zod'
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

export const MISSING_ID = 2_000_000_000

export const schemaMismatch = async (res: Response, schema: z.ZodType) => {
  const result = schema.safeParse(await res.json())
  return result.success ? null : z.prettifyError(result.error)
}
