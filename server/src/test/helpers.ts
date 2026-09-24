import { z } from 'zod'
import { db } from '@/db'
import { messages, chatMemberships, chatInvites, userBlocks, pets, chats, users } from '@/db/schema'
import { redis } from '@/lib/limiters'

export const resetDb = async () => {
  await db.delete(messages)
  await db.delete(chatMemberships)
  await db.delete(chatInvites)
  await db.delete(userBlocks)
  await db.delete(pets)
  await db.delete(chats)
  await db.delete(users)
}

export const resetRedis = async () => {
  const client = redis
  if (!client) return
  // The limiter sets enableOfflineQueue: false so a Redis outage fails requests
  // fast instead of hanging them. That also means commands issued while ioredis is
  // still opening the connection throw, which the first test file would otherwise
  // hit before the container has finished starting.
  if (client.status !== 'ready') {
    await new Promise<void>((resolve, reject) => {
      client.once('ready', resolve)
      client.once('error', reject)
    })
  }
  await client.flushdb()
}

export const MISSING_ID = 2_000_000_000

// This checks for the password key in the response body or a bcrypt hash value (that always starts with $2b$) 
// to make sure we don't accidentally leak a secret in another kvp
const leakedSecret = (text: string) =>
  text.includes('"password":') || text.includes('$2b$')

export const schemaMismatch = async (res: Response, schema: z.ZodType) => {
  const text = await res.text()
  if (leakedSecret(text)) return `Response leaked a secret:\n${text.slice(0, 300)}`

  const result = schema.safeParse(JSON.parse(text))
  return result.success ? null : z.prettifyError(result.error)
}
