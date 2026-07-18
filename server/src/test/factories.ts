import type { Pet, User, ChatInvite } from '@/db/schema'
import type { CreateUserInput, CreatePetInput } from '@/types'
import { db } from '@/db'
import { users, pets, chatInvites } from '@/db/schema'
import bcrypt from 'bcrypt'
import { coordsToLocation } from '@/lib/geo'
import { CreateInviteInput, Status, UpdateInviteStatusInput } from 'dogsplayingpoker-shared/invite'
import { add } from 'date-fns'

export const makeUser = (overrides: Partial<User> = {}): User => ({
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
  latitude: 41.8781,
  longitude: -87.6298,
  radiusMiles: 5,
  ...overrides,
})

export const setupUser = async (overrides: Partial<CreateUserInput> = {}) => {
  const userInput = makeUserInput(overrides)
  const hashed = await bcrypt.hash(userInput.password, 12)
  const convertedUserInput = {...userInput, password: hashed, location: coordsToLocation(overrides.latitude ?? null, overrides.longitude ?? null) }
  const [user] = await db.insert(users).values(convertedUserInput).returning()
  return user
}

export const setupUsers = async (count: number, overrides: Partial<CreateUserInput> = {}) => {
  const base = makeUserInput(overrides)
  const hashed = await bcrypt.hash(base.password, 12)
  const location = coordsToLocation(base.latitude, base.longitude)
  const userInput = { ...base, password: hashed, location }
  const input: CreateUserInput[] = []
  for (let i = 0; i < count; i++) {
    input.push({...userInput, username: `user${i}`, email: `user${i}@example.com` })
  }
  return await db.insert(users).values(input).returning()
}

export const makePet = (petId: number, ownerId: number, overrides: Partial<CreatePetInput> = {}): Pet => ({
  ...makePetInput(ownerId, overrides),
  id: petId,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
})

export const makePetInput = (ownerId: number, overrides: Partial<CreatePetInput> = {}): CreatePetInput => ({
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
  ...overrides,
})

export const setupPetForUser = async (ownerId: number, overrides: Partial<CreatePetInput> = {}) => {
  const petInput = makePetInput(ownerId, overrides)
  const [pet] = await db.insert(pets).values(petInput).returning()
  return pet
}

export const makeUpdateInviteStatusInput = (overrides: Partial<UpdateInviteStatusInput> = {}): UpdateInviteStatusInput => ({
  id: 1,
  status: 'pending',
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

