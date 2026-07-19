import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/db'
import { users, pets, UserRow, PetRow } from '@/db/schema'
import * as userService from '@/modules/user/service'
import { makeUserInput, setupPetForUser, setupUser, setupUsers } from '@/test/factories'
import { verifyAuthToken, verifyRefreshToken } from '@/lib/auth'

beforeEach(async () => {
  await db.delete(pets)
  await db.delete(users)
})

describe('userService.getUserById', () => {
  let testUser: UserRow
  let testPet: PetRow

  beforeEach(async () => {
    testUser = await setupUser()
    testPet = await setupPetForUser(testUser.id)
  })

  it('returns existing user', async () => {
    const result = await userService.getUserById(testUser.id)
    expect(result?.email).toBe(testUser.email)
  })

  it('returns associated pets', async () => {
    const result = await userService.getUserById(testUser.id)
    expect(result?.pets).toHaveLength(1)
    expect(result?.pets[0].name).toBe(testPet.name)
  })

  it('returns null if user id does not exist', async () => {
    const result = await userService.getUserById(14)
    expect(result).toBeNull()
  })
})

describe('userService.getUserByUsername', () => {
  let testUser: UserRow
  let testPet: PetRow

  beforeEach(async () => {
    testUser = await setupUser()
    testPet = await setupPetForUser(testUser.id)
  })

  it('returns existing user', async () => {
    const result = await userService.getUserByUsername(testUser.username)
    expect(result?.email).toBe(testUser.email)
  })

  it('returns associated pets', async () => {
    const result = await userService.getUserByUsername(testUser.username)
    expect(result?.pets).toHaveLength(1)
    expect(result?.pets[0].name).toBe(testPet.name)
  })

  it('returns null if username does not exist', async () => {
    const result = await userService.getUserByUsername('totally-fake')
    expect(result).toBeNull()
  })
})

describe('userService.loginUser', () => {
  let testUser: UserRow
  const password = 'fake-password'

  beforeEach(async () => {
    testUser = await setupUser({ password })
  })

  it('returns existing user', async () => {
    const result = await userService.loginUser(testUser.email, password)
    expect(result.user.email).toBe(testUser.email)
  })

  it('fails if user does not exist', async () => {
    await expect(userService.loginUser('fake@example.com', 'another-fake-password')).rejects.toThrow()
  })

  it('fails if wrong password', async () => {
    await expect(userService.loginUser(testUser.email, 'another-fake-password')).rejects.toThrow()
  })

  it('returns valid auth and refresh tokens', async () => {
    const result = await userService.loginUser(testUser.email, password)
    const decodedAuth = verifyAuthToken(result.authToken)
    expect(decodedAuth.userId).toBe(result.user.id)
    const decodedRefresh = verifyRefreshToken(result.refreshToken)
    expect(decodedRefresh.userId).toBe(result.user.id)
  })
})

describe('userService.createUser', () => {
  it('creates a user with hashed password', async () => {
    const result = await userService.createUser(makeUserInput({ username: 'sarah' }))
    expect(result.user.username).toBe('sarah')

    const rows = await db.select().from(users)
    expect(rows).toHaveLength(1)
    expect(rows[0].password).not.toBe('password123')
  })

  it('rejects duplicate username', async () => {
    await userService.createUser(makeUserInput({ username: 'sarah' }))
    await expect(userService.createUser(makeUserInput({ username: 'sarah' }))).rejects.toThrow()
  })

  it('rejects duplicate email', async () => {
    await userService.createUser(makeUserInput({ email: 'sarah@example.com' }))
    await expect(userService.createUser(makeUserInput({ email: 'sarah@example.com' }))).rejects.toThrow()
  })

  it('returns valid auth and refresh tokens', async () => {
    const result = await userService.createUser(makeUserInput())
    const decodedAuth = verifyAuthToken(result.authToken)
    expect(decodedAuth.userId).toBe(result.user.id)
    const decodedRefresh = verifyRefreshToken(result.refreshToken)
    expect(decodedRefresh.userId).toBe(result.user.id)
  })
})

describe('userService.searchUsersNearby', () => {
  const chicagoEnvelope = {
    swLat: 41.85, swLng: -87.70,
    neLat: 41.95, neLng: -87.55,
    centerLat: 41.88, centerLng: -87.63,
  }

  it('includes users inside the envelope', async () => {
    await setupUser({ location: { y: 41.88, x: -87.63 } })  // Chicago Loop
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.users).toHaveLength(1)
  })

  it('excludes users outside the envelope', async () => {
    await setupUser({ location: { y: 40.7128, x: -74.0060 } })  // NYC
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.users).toHaveLength(0)
  })

  it('includes users exactly on the southern boundary', async () => {
    await setupUser({ location: { y: 41.85, x: -87.63 } })  // exactly at swLat
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.users).toHaveLength(1)  // ST_MakeEnvelope includes boundary
  })

  it('sorts results by distance from center', async () => {
    await setupUser({ username: 'far', email: 'far@example.com', location: { y: 41.95, x: -87.55 } })
    await setupUser({ username: 'near', email: 'near@example.com', location: { y: 41.881, x: -87.629 } })
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.users[0].username).toBe('near')
    expect(result.users[1].username).toBe('far')
  })

  it('defaults to page 1 and pageSize 25', async () => {
    await setupUsers(30, { location: { y: 41.88, x: -87.63 } })
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.users).toHaveLength(25)
  })

  it('returns totalCount independent of page size', async () => {
    await setupUsers(30, { location: { y: 41.88, x: -87.63 } })
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.totalCount).toBe(30)
  })

  it('respects pagination', async () => {
    await setupUsers(30, { location: { y: 41.88, x: -87.63 } })
    const page1 = await userService.searchUsersNearby({ ...chicagoEnvelope, page: 1 })
    const page2 = await userService.searchUsersNearby({ ...chicagoEnvelope, page: 2 })
    expect(page1.users).toHaveLength(25)
    expect(page2.users).toHaveLength(5)
    expect(page1.users[0].id).not.toBe(page2.users[0].id)
  })

  it('embeds pets in results', async () => {
    const user = await setupUser({ location: { y: 41.88, x: -87.63 } })
    await setupPetForUser(user.id)
    const result = await userService.searchUsersNearby(chicagoEnvelope)
    expect(result.users).toHaveLength(1)
    expect(result.users[0].pets).toHaveLength(1)
  })
})

describe('userService.updateUserProfile', () => {
  it('updates a username', async () => {
    const user = await userService.createUser(makeUserInput({ username: 'sarah' }))
    const updatedUser = await userService.updateUserProfile(user.user.id, { username: 'sarah_updated' })
    expect(updatedUser.username).toBe('sarah_updated')
  })

  it('updates a profile image url', async () => {
    const user = await userService.createUser(makeUserInput({ username: 'sarah' }))
    const updatedUser = await userService.updateUserProfile(user.user.id, { profileImageUrl: 'https://example.com/profile.jpg' })
    expect(updatedUser.profileImageUrl).toBe('https://example.com/profile.jpg')
  })

  it('updates location and radiusMiles if lat/lng/rad are provided', async () => {
    const locationInput = { location: { y: 1, x: 2 }, radiusMiles: 3 }
    const user = await userService.createUser(makeUserInput())
    const updatedUser = await userService.updateUserProfile(user.user.id, locationInput)
    expect(updatedUser.location!.y).toBe(1)
    expect(updatedUser.location!.x).toBe(2)
    expect(updatedUser.radiusMiles).toBe(3)
  })

  it('does not update if any of these three are not provided', async () => {
    const userInput = makeUserInput()
    const locationInput = { location: { y: 1, x: 2 } }
    const user = await userService.createUser(userInput)
    const updatedUser = await userService.updateUserProfile(user.user.id, locationInput)
    expect(updatedUser.location).toBeNull()
  })

  it('rejects duplicate username', async () => {
    await userService.createUser(makeUserInput({ username: 'sarah' }))
    const user = await userService.createUser(makeUserInput({ username: 'john', email: 'john@example.com' }))
    await expect(userService.updateUserProfile(user.user.id, { username: 'sarah' })).rejects.toThrow()
  })
})