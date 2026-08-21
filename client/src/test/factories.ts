import type { FullUser } from 'dogsplayingpoker-shared/user'
import type { Pet } from 'dogsplayingpoker-shared/pet'
import type { FullMessage } from 'dogsplayingpoker-shared/message'

export const makeUser = (overrides: Partial<FullUser> = {}): FullUser => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  profileImageUrl: 'https://example.com/profile.jpg',
  location: {
    x: -87.6298,
    y: 41.8781
  },
  radiusMiles: 5,
  pets: [],
  ...overrides,
})



export const makeUsers = (count: number, overrides: Partial<FullUser> = {}): FullUser[] => {
  return Array.from({ length: count }, (_, i) =>
    makeUser({
      id: i + 1,
      username: `testuser${i + 1}`,
      ...overrides,
    })
  )
}

export const makeMessage = (overrides: Partial<FullMessage> & { id: number; createdBy: number } ): FullMessage => ({
  content: `message ${overrides.id}`,
  chatId: 1,
  createdAt: new Date(`2024-01-01T00:00:00.000Z`),
  updatedAt: new Date(`2024-01-01T00:00:00.000Z`),
  deletedAt: null,
  creator: makeUser({ id: overrides.createdBy }),
  ...overrides,
})

export const makePet = (overrides: Partial<Pet> = {}): Pet => ({
  id: 1,
  name: 'Test Pet',
  age: 0,
  breed: 'Test Breed',
  pictureUrl: 'https://example.com/pet.jpg',
  size: 'small',
  dogReactivity: 'none',
  dogReactivityNotes: '',
  catReactivity: 'none',
  catReactivityNotes: '',
  kidReactivity: 'none',
  kidReactivityNotes: '',
  peopleReactivity: 'none',
  peopleReactivityNotes: '',
  ownerId: 1,
  ...overrides,
})