import type { Server, Socket } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from 'dogsplayingpoker-shared/socket'

export type InterServerEvents = Record<string, never>
export type SocketData = {
  userId: number
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>