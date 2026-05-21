import { and, eq, isNull } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { db } from '@/db'
import { users, pets, User } from '@/db/schema'
import { generateAuthToken, generateRefreshToken, verifyRefreshToken } from '@/lib/auth'
import { transformUser, coordsToLocation } from '@/lib/geo'

const PG_UNIQUE_VIOLATION = '23505'

export class AuthError extends Error {
  constructor(message: string, public status = 401) { super(message) }
}
export class ConflictError extends Error {
  constructor(message: string) { super(message) }
}

const userWithPets = async (user: User) => {
  const userPets = await db.select().from(pets).where(eq(pets.ownerId, user.id))
  return { ...transformUser(user), pets: userPets }
}

export const listUsers = async () => {
  const rows = await db.select().from(users).where(isNull(users.deletedAt))
  return Promise.all(rows.map(userWithPets))
}

export const getUserById = async (id: number) => {
  const rows = await db.select().from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
  return rows[0] ? userWithPets(rows[0]) : null
}

export const getUserByUsername = async (username: string) => {
  const rows = await db.select().from(users)
    .where(and(eq(users.username, username), isNull(users.deletedAt)))
  return rows[0] ? userWithPets(rows[0]) : null
}

export const loginUser = async (email: string, password: string) => {
  const rows = await db.select().from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
  const user = rows[0]
  if (!user) throw new AuthError('Invalid credentials')
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new AuthError('Invalid credentials')

  return {
    authToken: generateAuthToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    user: await userWithPets(user),
  }
}

export const createUser = async (input: {
  username: string
  email: string
  password: string
  profileImageUrl: string | null
  latitude: number | null
  longitude: number | null
  radiusMiles: number | null
}) => {
  try {
    const hashed = await bcrypt.hash(input.password, 12)
    const rows = await db.insert(users).values({
      username: input.username,
      email: input.email,
      password: hashed,
      profileImageUrl: input.profileImageUrl,
      location: coordsToLocation(input.latitude, input.longitude),
      radiusMiles: input.radiusMiles,
    }).returning()
    const user = rows[0]
    return {
      authToken: generateAuthToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      user: await userWithPets(user),
    }
  } catch (e: any) {
    if (e.code === PG_UNIQUE_VIOLATION) {
      if (e.constraint?.includes('email')) throw new ConflictError('That email is already in use')
      if (e.constraint?.includes('username')) throw new ConflictError('That username is already taken')
    }
    throw e
  }
}

export const refreshAccessToken = (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken)
  return { authToken: generateAuthToken(payload.userId) }
}