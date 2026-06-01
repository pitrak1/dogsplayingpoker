import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth, getAuthToken } from '@/context/auth'
import { clearAllCookies } from '@/test/vitest.setup'
import { makeUser } from '@/test/factories'
import { setCookie } from '@/lib/cookies'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthProvider + useAuth', () => {
  beforeEach(clearAllCookies)
  const testUser = makeUser()

  it('starts with no user when no cookie exists', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
  })

  it('hydrates user from cookie on mount', () => {
    setCookie('user', JSON.stringify(testUser), 60)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user?.username).toBe('sarah')
  })

  it('setAuth updates user state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    expect(result.current.user?.username).toBe('sarah')
  })

  it('setAuth persists the auth token to a cookie', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    expect(getAuthToken()).toBe('token123')
  })

  it('setAuth persists the user to a cookie', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    expect(document.cookie).toContain('user=')
  })

  it('clearAuth removes user state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    act(() => {
      result.current.clearAuth()
    })
    expect(result.current.user).toBeNull()
  })

  it('clearAuth removes the auth token cookie', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    act(() => {
      result.current.clearAuth()
    })
    expect(getAuthToken()).toBeNull()
  })
})

describe('useAuth outside provider', () => {
  it('throws a helpful error', () => {
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/)
  })
})