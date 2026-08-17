import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { app } from './app'
import { Server, Socket } from 'socket.io'
import { registerUser } from './socket/socketHandlers'
import { verifyAuthToken } from './lib/auth'
import { ClientToServerEvents, ServerToClientEvents } from 'dogsplayingpoker-shared/socket'
import { InterServerEvents, SocketData } from './socket/types'

const port = Number(process.env.PORT ?? 4000)

// Set only in the container. Its presence is what switches this process from
// "API server that Vite proxies to" into "the whole app on one origin".
const clientDist = process.env.CLIENT_DIST

// In dev the browser sits on Vite's origin and the socket dials this one
// cross-origin, so it has to be allowed. Served from clientDist there is no
// second origin, and no CORS config at all is the correct answer.
const clientOrigin = process.env.CLIENT_ORIGIN ?? (clientDist ? undefined : 'http://localhost:5173')

if (clientDist) {
  // Real files win: JS, CSS, images, anything Vite emitted.
  app.use('/*', serveStatic({ root: clientDist }))

  // Whatever is left is either a bad API call, which should stay a 404, or a
  // react-router path, which the client resolves once index.html has loaded.
  app.get('*', (c, next) => {
    if (c.req.path.startsWith('/api')) return next()
    return serveStatic({ path: `${clientDist}/index.html` })(c, next)
  })
}

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server:    http://localhost:${info.port}`)
})

export const io = new Server<
  ClientToServerEvents, 
  ServerToClientEvents, 
  InterServerEvents, 
  SocketData
>(server, clientOrigin ? { cors: { origin: clientOrigin } } : {})

io.use((socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, next) => {
  const token = (socket.handshake.auth as { token?: string }).token
  try {
    if (!token) return next(new Error('Unauthorized'))
    const decoded = verifyAuthToken(token)
    socket.data.userId = decoded.userId
    next()
  } catch {
    next(new Error('Unauthorized'))
  }
})

io.on('connect', (socket) => {
  registerUser(io, socket)
})
