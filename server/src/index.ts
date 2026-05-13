import 'dotenv/config'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { useCookies } from '@whatwg-node/server-plugin-cookies'
import { schema } from './schema'
import { verifyAuthToken } from '@/lib/auth'

export type GraphQLContext = {
  userId?: number
}

const yoga = createYoga<GraphQLContext>({
  schema,
  plugins: [useCookies()],
  context: async ({ request }): Promise<GraphQLContext> => {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) return {}

    try {
      const payload = verifyAuthToken(token)
      return { userId: payload.userId }
    } catch {
      return {}
    }
  }
})

const server = createServer(yoga)

const port = process.env.PORT ?? 4000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`)
})
