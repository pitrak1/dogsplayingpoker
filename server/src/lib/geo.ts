import { sql } from 'drizzle-orm'
import { User } from '@/db/schema'
import { UserWithCoords } from '@/types'

export const locationToCoords = (location: { x: number, y: number } | null): { latitude: number | null, longitude: number | null } => {
  if (!location) return { latitude: null, longitude: null }
  return { latitude: location.y, longitude: location.x }
}

export const coordsToLocation = (latitude: number | null, longitude: number | null) => {
  if (latitude === null || longitude === null) return null
  return sql`ST_MakePoint(${longitude}, ${latitude})`
}

export const transformUserOrNull = (user: User | null): UserWithCoords | null => {
  return user ? transformUser(user) : null
}

export const transformUser = (user: User): UserWithCoords => {
  const coords = locationToCoords(user.location)
  return { ...user, ...coords }
}
