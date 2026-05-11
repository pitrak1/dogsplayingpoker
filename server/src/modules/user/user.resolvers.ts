import { eq, isNull, and } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import bcrypt from 'bcrypt'

export const userResolvers = {
  Query: {
    users: () => db.select().from(users).where(isNull(users.deletedAt)),
    user: async (_: unknown, { id }: { id: number }) => {
      const rows = await db.select().from(users).where(and(eq(users.id, id), isNull(users.deletedAt)))
      return rows[0] ?? null
    }
  },
  Mutation: {
    createUser: async (
      _: unknown, 
      { username, email, password }: { username: string, email: string, password: string}) => {
      const hashed = await bcrypt.hash(password, 12)
      const values = { username, email, password: hashed }
      const rows = await db.insert(users).values(values).returning()
      return rows[0]
    }
  },
}