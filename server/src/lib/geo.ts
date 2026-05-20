import { sql } from 'drizzle-orm'

export const locationToCoords = (location: { x: number, y: number } | null) => {
  if (!location) return { latitude: null, longitude: null }
  return { latitude: location.y, longitude: location.x }
}

export const coordsToLocation = (latitude: number | null, longitude: number | null) => {
  if (latitude === null || longitude === null) return null
  return sql`ST_MakePoint(${longitude}, ${latitude})`
}

export const transformUser = <T extends { location: { x: number, y: number } | null }>(user: T | null) => {
  if (!user) return null
  const coords = locationToCoords(user.location)
  return { ...user, ...coords }
}
