import '@testing-library/jest-dom/vitest'

import * as authContext from '@/context/auth'
import { makeUser } from '@/test/factories'
import { useEffect } from 'react'
import { vi } from 'vitest'
import type { UserWithPets as User } from 'dogsplayingpoker-shared/user'

vi.mock('@/components/userMap', () => ({
  UserMap: ({ children, onMapReady, isBlocked }: any) => {
    useEffect(() => {
      if (onMapReady) onMapReady({
        easeTo: vi.fn()
      } as any)  // fake map instance
    }, [onMapReady])
    return (
      <div>
        MAP HERE
        {isBlocked && children}
      </div>
    )
  }
}))

vi.mock('@mapbox/search-js-react', () => ({
  SearchBox: ({ onRetrieve }: any) => (
    <button
      data-testid="trigger-retrieve"
      onClick={() =>
        onRetrieve({
          features: [{
            properties: { name: 'Chicago, IL' },
            geometry: { coordinates: [-87.6298, 41.8781] },
          }],
        })
      }
    >
      retrieve
    </button>
  ),
}))

// Cookies are weird because when setting document.cookie, you're actually appending
// each cookie can only be removed with max-age=0 or expires=<past date>
export const clearAllCookies = () => {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim()
    document.cookie = `${name}=; path=/; max-age=0`
  })
}