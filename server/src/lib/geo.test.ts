import { describe, it, expect } from 'vitest'
import { transformUser, transformUserOrNull, coordsToLocation } from './geo'
import { makeUser } from '@/test/factories'
import { PgDialect } from 'drizzle-orm/pg-core'

describe('transformUser', () => {
  it('extracts lat/lng from a location point', () => {
    const user = makeUser({ location: { x: -87.6298, y: 41.8781 } })
    const result = transformUser(user)
    expect(result).toBeDefined()
    expect(result.latitude).toBe(41.8781)
    expect(result.longitude).toBe(-87.6298)
  })

  it('returns null lat/lng when location is null', () => {
    const user = makeUser()
    const result = transformUser(user)
    expect(result).toBeDefined()
    expect(result.latitude).toBeNull()
    expect(result.longitude).toBeNull()
  })

  it('preserves other fields', () => {
    const user = makeUser({ 
      username: 'sarah',
      email: 'sarah@example.com',
      location: { x: -87.6298, y: 41.8781 } 
    })
    const result = transformUser(user)
    expect(result).toBeDefined()
    expect(result.username).toBe('sarah')
    expect(result.email).toBe('sarah@example.com')
  })
})

describe('transformUserOrNull', () => {
  it('returns null if user is null', () => {
    const result = transformUserOrNull(null)
    expect(result).toBeNull()
  })
})

describe('coordsToLocation', () => {
  it('returns null when lat/lng is null', () => {
    const result = coordsToLocation(null, 1.85345)
    expect(result).toBeNull()
  })

  it('returns sql expression for location', () => {
    const dialect = new PgDialect()
    const sqlResult = coordsToLocation(41.8781, -87.6298)
    expect(sqlResult).toBeDefined()
    const result = dialect.sqlToQuery(sqlResult!)
    expect(result.sql).toBe('ST_MakePoint($1, $2)')
    expect(result.params).toEqual([-87.6298, 41.8781])
  })
})