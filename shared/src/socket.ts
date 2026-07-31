import { Message } from './message'
import { User } from './user'

export type ServerToClientEvents = {
 messageReceived: (user: User, message: Message) => void
 messageNotification: (chatId: number) => void
}

export type ClientToServerEvents = {
  joinChat: (chatId: number) => void
  leaveChat: (chatId: number) => void
  sendMessage: (chatId: number, content: string) => void
}