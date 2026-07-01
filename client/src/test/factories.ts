import type { User } from '@/types/user'
import type { Pet } from 'dogsplayingpoker-shared/schemas/pet'

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashed',
  profileImageUrl: 'https://example.com/profile.jpg',
  latitude: 41.8781,
  longitude: -87.6298,
  radiusMiles: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  pets: [],
  ...overrides,
})



export const makeUsers = (count: number, overrides: Partial<User> = {}): User[] => {
  return Array.from({ length: count }, (_, i) =>
    makeUser({
      id: i + 1,
      username: `testuser${i + 1}`,
      ...overrides,
    })
  )
}

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