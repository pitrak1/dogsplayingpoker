import { eq, isNull, and } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'
import { YogaInitialContext } from 'graphql-yoga'
import { generateAuthToken, generateRefreshToken, setRefreshTokenCookie, getRefreshTokenFromCookies, verifyRefreshToken } from '@/lib/auth'
import { GraphQLContext } from '@/index'

type CreateUserArgs = {
  username: string,
  email: string,
  password: string,
  profileImageUrl: string | null
  latitude: number | null,
  longitude: number | null,
  radiusMiles: number | null
}

type LoginUserArgs = {
  email: string,
  password: string
}

const PG_UNIQUE_VIOLATION = '23505'

export const userResolvers = {
  Query: {
    users: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized', {
        extensions: { http: { status: 401 } }
      })
      return db.select().from(users).where(isNull(users.deletedAt))
    },
    user: async (_: unknown, { id }: { id: number }) => {
      const rows = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
      return rows[0] ?? null
    }
  },
  Mutation: {
    loginUser: async (_: unknown, { email, password }: LoginUserArgs, ctx: YogaInitialContext) => {
      try {
        const rows = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt)))
        const user = rows[0] ?? null

        if (!user) throw new GraphQLError('Invalid credentials')

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new GraphQLError('Invalid credentials')

        const authToken = generateAuthToken(user.id)
        const refreshToken = generateRefreshToken(user.id)
        await setRefreshTokenCookie(ctx, refreshToken)
        return { authToken, user }
      } catch (e: any) {
        throw new GraphQLError('Something went wrong')
      }
    },
    createUser: async (_: unknown, { username, email, password, profileImageUrl, latitude, longitude, radiusMiles }: CreateUserArgs, ctx: YogaInitialContext) => {
      try {
        const hashed = await bcrypt.hash(password, 12)
        const values = { username, email, password: hashed, profileImageUrl, latitude, longitude, radiusMiles }
        const rows = await db.insert(users).values(values).returning()
        const user = rows[0]
        const authToken = generateAuthToken(user.id)
        const refreshToken = generateRefreshToken(user.id)
        await setRefreshTokenCookie(ctx, refreshToken)
        return { authToken, user }
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
    },
    refreshToken: async (_: unknown, __: unknown, ctx: YogaInitialContext) => {
      const token = await getRefreshTokenFromCookies(ctx)
      if (!token) throw new GraphQLError('No refresh token')

      try {
        const payload = verifyRefreshToken(token)
        const authToken = generateAuthToken(payload.userId)
        return { authToken }
      } catch {
        throw new GraphQLError('Invalid or expired refresh token')
      }
    }
  },
}