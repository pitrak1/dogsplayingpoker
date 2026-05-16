import { eq, isNull, and } from 'drizzle-orm'
import { db } from '@/db'
import { pets } from '@/db/schema'
import bcrypt from 'bcrypt'
import { GraphQLError } from 'graphql'
import { YogaInitialContext } from 'graphql-yoga'
import { generateAuthToken, generateRefreshToken, setRefreshTokenCookie, getRefreshTokenFromCookies, verifyRefreshToken } from '@/lib/auth'
import { GraphQLContext } from '@/index'

type Reactivity = 'strong' | 'mixed' | 'none' | 'unknown'
type Size = 'giant' | 'large' | 'medium' | 'small' | 'toy' | 'unknown'

type AddEditPetArgs = {
  name: string,
  age: number,
  size: Size,
  breed: string,
  pictureUrl: string | null,
  dogReactivity: Reactivity,
  dogReactivityNotes: string | null,
  catReactivity: Reactivity,
  catReactivityNotes: string | null,
  kidReactivity: Reactivity,
  kidReactivityNotes: string | null,
  peopleReactivity: Reactivity,
  peopleReactivityNotes: string | null
}

export const petResolvers = {
  Query: {
    pets: async (_: unknown, { ownerId }: { ownerId: number }, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized', {
        extensions: { http: { status: 401 } }
      })
      return db.select().from(pets).where(eq(pets.ownerId, ownerId))
    },
    pet: async (_: unknown, { id }: { id: number }) => {
      const rows = await db
        .select()
        .from(pets)
        .where(eq(pets.id, id))
      return rows[0] ?? null
    }
  },
  Mutation: {
    addPet: async (_: unknown, values: AddEditPetArgs, ctx: GraphQLContext) => {
      if (!ctx.userId) throw new GraphQLError('Unauthorized', {
        extensions: { http: { status: 401 } }
      })

      try {
        const valuesWithOwner = { ...values, ownerId: ctx.userId }
        const rows = await db.insert(pets).values(valuesWithOwner).returning()
        const pet = rows[0]
        return { pet }
      } catch (e: any) {
        throw new GraphQLError('Something went wrong')
      }
    },
  },
}