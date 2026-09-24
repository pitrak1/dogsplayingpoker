import { and, eq, isNull, sql, inArray } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { db } from '@/db'
import { users, pets, safeUserColumns, type SafeUserRow, publicUserColumns } from '@/db/schema'
import { generateAuthToken, generateRefreshToken, verifyRefreshToken } from '@/lib/auth'
import { PG_UNIQUE_VIOLATION, AuthError, ConflictError } from '@/lib/errors'
import { DatabaseError } from 'pg'
import type { NewUserRow } from '@/db/schema'
import type { SQL } from 'drizzle-orm'
import { normalizeEmail } from '@/lib/email'
import type { CreateUserInput, EditUserInput, PublicPaginatedUsers, PaginatedUsers, SearchUserInput } from 'dogsplayingpoker-shared/user'

const getFullUser = async (user: SafeUserRow) => {
  const userPets = await db.select().from(pets).where(eq(pets.ownerId, user.id))
  return { ...user, pets: userPets }
}

export const getFullUserById = async (id: number) => {
  const rows = await db.select(safeUserColumns).from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
  return rows[0] ? await getFullUser(rows[0]) : null
}

export const getUserById = async (id: number) => {
  const rows = await db.select(safeUserColumns).from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
  return rows[0] ?? null
}

export const getUserByUsername = async (username: string) => {
  const rows = await db.select(safeUserColumns).from(users)
    .where(and(eq(users.username, username), isNull(users.deletedAt)))
  return rows[0] ? await getFullUser(rows[0]) : null
}

export const loginUser = async (email: string, password: string) => {
  const rows = await db.select().from(users)
    .where(and(eq(users.email, normalizeEmail(email)), isNull(users.deletedAt)))
  const row = rows[0]
  if (!row) throw new AuthError('Invalid credentials')
  const valid = await bcrypt.compare(password, row.password)
  if (!valid) throw new AuthError('Invalid credentials')

  // This is the only endpoint that explicitly needs the password column
  // after comparison, we want to drop it explicitly just to be safe
  const { password: _password, ...user } = row

  return {
    authToken: generateAuthToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    user: await getFullUser(user),
  }
}

export const createUser = async (input: CreateUserInput) => {
  try {
    const hashed = await bcrypt.hash(input.password, 12)
    const rows = await db.insert(users).values({
      username: input.username,
      email: normalizeEmail(input.email),
      password: hashed,
    }).returning(safeUserColumns)
    const user = rows[0]
    return {
      authToken: generateAuthToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      user: await getFullUser(user),
    }
  } catch (e: unknown) {
    if (e instanceof DatabaseError && e.code === PG_UNIQUE_VIOLATION) {
      if (e.constraint?.includes('email')) throw new ConflictError('That email is already in use', 'email')
      if (e.constraint?.includes('username')) throw new ConflictError('That username is already in use', 'username')
    }
    throw e
  }
}

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken)
  const user = await getFullUserById(payload.userId)
  if (!user) throw new AuthError('User no longer exists')
  return { authToken: generateAuthToken(user.id), user }
}

type SearchParams = SearchUserInput & { isAuthenticated: boolean }

export function searchUsersNearby(params: SearchUserInput & { isAuthenticated: true }): Promise<PaginatedUsers>
export function searchUsersNearby(params: SearchUserInput & { isAuthenticated: false }): Promise<PublicPaginatedUsers>
export function searchUsersNearby(params: SearchParams): Promise<PaginatedUsers | PublicPaginatedUsers>

export async function searchUsersNearby(params: SearchUserInput & { isAuthenticated: boolean }): Promise<PaginatedUsers | PublicPaginatedUsers> {
  const pageSize = params.pageSize ?? 25
  const offset = ((params.page ?? 1) - 1) * pageSize

  const center = sql`ST_MakePoint(${params.centerLng}, ${params.centerLat})::geography`
  const envelope = sql`ST_MakeEnvelope(${params.swLng}, ${params.swLat}, ${params.neLng}, ${params.neLat}, 4326)`

  const columns = params.isAuthenticated ? safeUserColumns : publicUserColumns

  const [userRows, totalCount] = await Promise.all([
    db.select({
      ...columns,
      distanceMeters: sql<number>`ST_Distance(${users.location}::geography, ${center})`.as('distance_meters'),
    })
      .from(users)
      .where(and(
        isNull(users.deletedAt),
        sql`${users.location} && ${envelope}`,
      ))
      .orderBy(sql`distance_meters`)
      .limit(pageSize)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(and(
        isNull(users.deletedAt),
        sql`${users.location} && ${envelope}`
      ))
      .then(r => r[0].count)
  ])

  if (userRows.length === 0) return { users: [], totalCount: 0 }

  // We don't need to include pets for unauthenticated users
  if (!params.isAuthenticated) return { users: userRows, totalCount }

  // Single query for all pets across all returned users
  const userIds = userRows.map((u) => u.id)
  const allPets = await db.select().from(pets).where(inArray(pets.ownerId, userIds))

  // Group pets by owner
  const petsByOwner = new Map<number, typeof allPets>()
  for (const pet of allPets) {
    const list = petsByOwner.get(pet.ownerId) ?? []
    list.push(pet)
    petsByOwner.set(pet.ownerId, list)
  }

  // Combine
  const fullUsers = userRows.map((row) => ({
    ...row,
    distanceMeters: row.distanceMeters,
    pets: petsByOwner.get(row.id) ?? [],
  }))

  return { users: fullUsers, totalCount }
}

export const updateUserProfile = async (userId: number, input: EditUserInput) => {
  const updates: Omit<Partial<NewUserRow>, 'location'> & { location?: SQL | null } = {}

  if (input.username) updates.username = input.username
  if (input.profileImageUrl) updates.profileImageUrl = input.profileImageUrl

  // This handles setting and clearing a user's location
  if (input.location !== undefined && input.radiusMiles !== undefined) {
    updates.radiusMiles = input.radiusMiles
    if (input.location && input.radiusMiles) {
      updates.location = sql`ST_MakePoint(${input.location.x}, ${input.location.y})`
    } else {
      updates.location = null
    }
  }
  updates.updatedAt = new Date()

  try {
    const rows = await db
      .update(users)
      .set(updates)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)))
      .returning(safeUserColumns)
    return getFullUser(rows[0])
  } catch (e: unknown) {
    if (e instanceof DatabaseError && e.code === PG_UNIQUE_VIOLATION) {
      if (e.constraint?.includes('username')) throw new ConflictError('That username is already taken', 'username')
    }
    throw e
  }
}