import { createSchema } from 'graphql-yoga'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { players } from './db/schema'

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Player {
      id: Int!
      name: String!
      chips: Int!
    }

    type Query {
      players: [Player!]!
      player(id: Int!): Player
    }

    type Mutation {
      addPlayer(name: String!, chips: Int!): Player!
    }
  `,
  resolvers: {
    Query: {
      players: () => db.select().from(players),
      player: async (_: unknown, { id }: { id: number }) => {
        const rows = await db.select().from(players).where(eq(players.id, id))
        return rows[0] ?? null
      },
    },
    Mutation: {
      addPlayer: async (_: unknown, { name, chips }: { name: string; chips: number }) => {
        const rows = await db.insert(players).values({ name, chips }).returning()
        return rows[0]
      },
    },
  },
})
