import '@testing-library/jest-dom/vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

import { useEffect } from 'react'
import { beforeEach, vi } from 'vitest'

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
// AuthProvider calls /auth/refresh on mount when there's no access token cookie, and
// jsdom's fetch can't resolve relative URLs. Stub fetch globally and default every test
// to "no session" (401). restoreMocks resets implementations between tests, so the
// default is re-applied in beforeEach rather than set once here.
export const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockResolvedValue(new Response(null, { status: 401 }))
})

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
