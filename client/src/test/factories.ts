import type { User } from '@/types/user'

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashed',
  profileImageUrl: null,
  latitude: 41.8781,
  longitude: -87.6298,
  radiusMiles: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  ...overrides,
})