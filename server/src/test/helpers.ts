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

// An id no serial will realistically reach, for tests asserting a row is absent.
// A small literal is unsafe here: resetDb uses DELETE, which leaves the identity
// sequences climbing across runs, so a hardcoded id eventually collides with a row
// the test itself just created. Kept under the int4 ceiling `serial` implies — a
// larger value would make Postgres raise a range error instead of returning null.
export const MISSING_ID = 2_000_000_000
