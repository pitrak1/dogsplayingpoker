import { eq, isNull, and } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'

type CreateUserArgs = {
  username: string, 
  email: string, 
  password: string
}

const PG_UNIQUE_VIOLATION = '23505'

export const userResolvers = {
  Query: {
    users: () => db.select().from(users).where(isNull(users.deletedAt)),
    user: async (_: unknown, { id }: { id: number }) => {
      const rows = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
      return rows[0] ?? null
    }
  },
  Mutation: {
    createUser: async (_: unknown, { username, email, password }: CreateUserArgs) => {
      try {
        const hashed = await bcrypt.hash(password, 12)
        const values = { username, email, password: hashed }
        const rows = await db.insert(users).values(values).returning()
        return rows[0]
      } catch (e: any) {
        if (e.code === PG_UNIQUE_VIOLATION) {
          if (e.constraint?.includes('email')) {
            throw new GraphQLError('That email is already in use')
          }
          if (e.constraint?.includes('username')) {
            throw new GraphQLError('That username is already taken')
          }
        }
        throw new GraphQLError('Something went wrong')
      }
    }
  },
}