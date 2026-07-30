import 'dotenv/config'
import { serve } from '@hono/node-server'
import { app } from './app'
import { Server, Socket } from 'socket.io'
import { registerUser } from './socket/socketHandlers'
import { verifyAuthToken } from './lib/auth'
import { ClientToServerEvents, ServerToClientEvents } from 'dogsplayingpoker-shared/socket'
import { InterServerEvents, SocketData } from './socket/types'

const port = Number(process.env.PORT ?? 4000)

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server:    http://localhost:${info.port}`)
})

export const io = new Server<
  ClientToServerEvents, 
  ServerToClientEvents, 
  InterServerEvents, 
  SocketData
>(server, {
  cors: {
    origin: "http://localhost:5173"
  }
})

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
