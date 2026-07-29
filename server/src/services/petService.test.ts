import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '@/db'
import { pets } from '@/db/schema'
import * as petService from '@/services/petService'
import { setupPetForUser, makePetInput, setupUser } from '@/test/factories'
import { resetDb } from '@/test/helpers'

beforeEach(resetDb)

describe('petService.listPetsForOwner', () => {
  it('returns pets for owner', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    await setupPetForUser(user.id)
    const result = await petService.listPetsForOwner(user.id)
    expect(result).toHaveLength(2)
  })

  it('only returns pets for the specified owner', async () => {
    const sarah = await setupUser({ username: 'sarah', email: 'sarah@example.com' })
    const mike = await setupUser({ username: 'mike', email: 'mike@example.com' })
    await setupPetForUser(sarah.id)
    await setupPetForUser(sarah.id)
    await setupPetForUser(mike.id)

    const result = await petService.listPetsForOwner(sarah.id)
    expect(result).toHaveLength(2)
    expect(result.every(p => p.ownerId === sarah.id)).toBe(true)
  })
})

describe('petService.getPetById', () => {
  it('returns pet', async () => {
    const user = await setupUser()
    const pet = await setupPetForUser(user.id)
    const result = await petService.getPetById(pet.id)
    expect(result).not.toBeNull()
    expect(result!.name).toEqual(pet.name)
  })

  it('returns null if id does not exist', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const result = await petService.getPetById(94)
    expect(result).toBeNull()
  })
})

describe('petService.createPet', () => {
  it('creates pet', async () => {
    const user = await setupUser()
    const result = await petService.createPet(makePetInput(user.id))

    const rows = await db.select().from(pets)
    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe(result.name)
  })

  it('fails if owner does not exist', async () => {
    await expect(petService.createPet(makePetInput(16))).rejects.toThrow()
  })
})

describe('petService.editPet', () => {
  it('updates pet', async () => {
    const user = await setupUser()
    const pet = await setupPetForUser(user.id, { age: 11 })
    const result = await petService.editPet(pet.id, makePetInput(user.id, { age: 12 }))
    expect(result).not.toBeNull()

    const rows = await db.select().from(pets)
    expect(rows).toHaveLength(1)
    expect(rows[0].age).toBe(result!.age)
  })

  it('returns null if pet does not exist', async () => {
    const user = await setupUser()
    await setupPetForUser(user.id)
    const result = await petService.editPet(94, makePetInput(user.id))
    expect(result).toBeNull()
  })
})
