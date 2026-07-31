import { TypedServer, TypedSocket } from "./types"
import { createMessage } from '@/services/chatService'
import { getUserById } from "@/services/userService"

export const registerUser = (io: TypedServer, socket: TypedSocket) => void(async () => {
  const userId = socket.data.userId
  console.log('registered user', userId)
  await socket.join(`user:${userId}`)

  socket.on('joinChat', (chatId: number) => void joinChat(socket, chatId))
  socket.on('leaveChat', (chatId: number) => void leaveChat(socket, chatId))
  socket.on('sendMessage', (chatId: number, content: string) => void sendMessage(io, socket, chatId, content))
})()

const joinChat = async (socket: TypedSocket, chatId: number) => {
  console.log('joined chat', socket.data.userId)
  await socket.join(`chat:${chatId}`)
}

const leaveChat = async (socket: TypedSocket, chatId: number) => {
  console.log('left chat', socket.data.userId)
  await socket.leave(`chat:${chatId}`)
}

const sendMessage = async (io: TypedServer, socket: TypedSocket, chatId: number, content: string) => {
  console.log('sent message', socket.data.userId, chatId, content)
  const userId = socket.data.userId
  const message = await createMessage(userId, chatId, { content })
  const user = await getUserById(userId)
  io.to(`chat:${chatId}`).emit('messageReceived', user, message)
  // const members = await getMembersForChat(chatId)
  // members.forEach(m => io.to(`user:${m.users.id}`).emit('messageNotification', chatId))
}