import 'dotenv/config'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema'

const yoga = createYoga({ schema })

const server = createServer(yoga)

const port = process.env.PORT ?? 4000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/graphql`)
})
