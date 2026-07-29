import type { PetRow, UserRow } from '@/db/schema'
import { db } from '@/db'
import { users, pets, chatInvites, chats, chatMemberships, messages } from '@/db/schema'
import bcrypt from 'bcrypt'
import { CreateInviteInput, Status } from 'dogsplayingpoker-shared/invite'
import { CreateUserInput } from 'dogsplayingpoker-shared/user'
import { CreatePetInput } from 'dogsplayingpoker-shared/pet'
import { add } from 'date-fns'
import { CreateMessageInput } from 'dogsplayingpoker-shared/message'

export const makeUser = (overrides: Partial<UserRow> = {}): UserRow => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashed',
  profileImageUrl: null,
  location: null,
  radiusMiles: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides,
})

export const makeUserInput = (overrides: Partial<CreateUserInput> = {}): CreateUserInput => ({
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashed',
  profileImageUrl: null,
  location: {
    x: -87.6298,
    y: 41.8781
  },
  radiusMiles: 5,
  ...overrides,
})

export const setupUser = async (overrides: Partial<CreateUserInput> = {}) => {
  const userInput = makeUserInput(overrides)
  const hashed = await bcrypt.hash(userInput.password, 12)
  const convertedUserInput = {...userInput, password: hashed }
  const [user] = await db.insert(users).values(convertedUserInput).returning()
  return user
}

export const setupUsers = async (count: number, overrides: Partial<CreateUserInput> = {}) => {
  const base = makeUserInput(overrides)
  const hashed = await bcrypt.hash(base.password, 12)
  const userInput = { ...base, password: hashed }
  const input: CreateUserInput[] = []
  for (let i = 0; i < count; i++) {
    input.push({...userInput, username: `user${i}`, email: `user${i}@example.com` })
  }
  return await db.insert(users).values(input).returning()
}

export const makePet = (petId: number, ownerId: number, overrides: Partial<PetRow> = {}): PetRow => ({
  id: petId,
  name: 'testuser',
  age: 1,
  size: 'medium',
  breed: 'husky',
  pictureUrl: null,
  dogReactivity: 'unknown',
  dogReactivityNotes: null,
  catReactivity: 'unknown',
  catReactivityNotes: null,
  kidReactivity: 'unknown',
  kidReactivityNotes: null,
  peopleReactivity: 'unknown',
  peopleReactivityNotes: null,
  ownerId,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides
})

export const makePetInput = (overrides: Partial<CreatePetInput> = {}): CreatePetInput => ({
  name: 'testuser',
  age: 1,
  size: 'medium',
  breed: 'husky',
  pictureUrl: null,
  dogReactivity: 'unknown',
  dogReactivityNotes: null,
  catReactivity: 'unknown',
  catReactivityNotes: null,
  kidReactivity: 'unknown',
  kidReactivityNotes: null,
  peopleReactivity: 'unknown',
  peopleReactivityNotes: null,
  ...overrides,
})

export const setupPetForUser = async (ownerId: number, overrides: Partial<CreatePetInput> = {}) => {
  const petInput = makePetInput(overrides)
  const [pet] = await db.insert(pets).values({ ...petInput, ownerId }).returning()
  return pet
}

export const makeCreateInviteInput = (overrides: Partial<CreateInviteInput> = {}): CreateInviteInput => ({
  receiverId: 2,
  message: 'fake-message',
  ...overrides
})

export const makeInvite = (overrides: Partial<CreateInviteInput> = {}) => ({
  id: 1,
  message: 'some fake message',
  senderId: 2,
  receiverId: 3,
  status: 'pending' as Status,
  createdAt: new Date(),
  updatedAt: new Date(),
  expiredAt: new Date(),
  ...overrides
})

export const setupInvite = async (
  senderId: number, 
  receiverId: number, 
  message?: string | null, 
  status?: Status | null
) => {
  const input = {
    senderId,
    receiverId,
    message,
    status: status ?? 'pending',
    expiredAt: add(new Date(), { weeks: 2 })
  }
  const [invite] = await db.insert(chatInvites).values(input).returning()
  return invite
}

export const makeChat = (overrides: Partial<{ hostId: number }> = {}) => ({
  id: 1,
  hostId: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  ...overrides
})

export const setupChat = async (hostId: number) => {
  const [chat] = await db.insert(chats).values({ hostId }).returning()
  return chat
}

export const makeChatMembership = (chatId: number, userId: number) => ({
  id: 1,
  chatId,
  userId,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
})

export const setupChatMembership = async (
  chatId: number, 
  userId: number, 
) => {
  const input = {
    chatId,
    userId,
  }
  const [chat] = await db.insert(chatMemberships).values(input).returning()
  return chat
}

export const makeMessage = (chatId: number, createdBy: number, content: string) => ({
  id: 1,
  chatId,
  content,
  createdBy,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
})

export const setupMessage = async (chatId: number, createdBy: number) => {
  const input = { chatId, createdBy, content: 'fake content here' }
  const [message] = await db.insert(messages).values(input).returning()
  return message
}

export const setupMessages = async (count: number, chatId: number, createdBy: number) => {
  const values = { chatId, createdBy }
  const input: { content: string, chatId: number, createdBy: number }[] = []
  for (let i = 0; i < count; i++) {
    input.push({ ...values, content: `message${i}` })
  }
  return await db.insert(messages).values(input).returning()
}