import { TypedServer, TypedSocket } from "./types"

export const registerUser = (io: TypedServer, socket: TypedSocket) => {
  console.log('registered user', socket.data.userId)
}