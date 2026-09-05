import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth, getAuthToken } from '@/context/auth'
import { clearAllCookies, mockFetch, jsonResponse } from '@/test/vitest.setup'
import { makeUser } from '@/test/factories'
import { setCookie } from '@/lib/cookies'
import { renderHookWithProviders } from '@/test/wrapper'

const testUser = makeUser({ username: 'sarah' })

describe('AuthProvider boot', () => {
  beforeEach(clearAllCookies)

  it('is ready immediately and skips the refresh when an auth token cookie exists', () => {
    setCookie('authToken', 'token123', 60)
    const { result } = renderHookWithProviders(() => useAuth())
    expect(result.current.ready).toBe(true)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('starts not ready and attempts a refresh when no auth token cookie exists', async () => {
    const { result } = renderHookWithProviders(() => useAuth())
    expect(result.current.ready).toBe(false)
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/refresh',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    )
    expect(result.current.user).toBeNull()
  })

  it('hydrates the user and auth token from a successful refresh', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ authToken: 'fresh', user: testUser }))
    const { result } = renderHookWithProviders(() => useAuth())
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.user?.username).toBe('sarah')
    expect(getAuthToken()).toBe('fresh')
    expect(document.cookie).toContain('user.v2=')
  })

  it('clears a stale user cookie when the refresh is rejected', async () => {
    setCookie('user.v2', JSON.stringify(testUser), 60)
    const { result } = renderHookWithProviders(() => useAuth())
    // Hydrates optimistically from the cookie before the refresh settles
    expect(result.current.user?.username).toBe('sarah')
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.user).toBeNull()
    expect(document.cookie).not.toContain('user.v2=')
  })

  it('becomes ready and keeps the stored user when the refresh request fails to send', async () => {
    setCookie('user.v2', JSON.stringify(testUser), 60)
    mockFetch.mockRejectedValueOnce(new TypeError('network down'))
    const { result } = renderHookWithProviders(() => useAuth())
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.user?.username).toBe('sarah')
  })

  it('ignores a refresh response that fails schema validation', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ authToken: 'fresh' })) // missing user
    const { result } = renderHookWithProviders(() => useAuth())
    await waitFor(() => expect(result.current.ready).toBe(true))
    expect(result.current.user).toBeNull()
    expect(getAuthToken()).toBeNull()
  })
})

describe('AuthProvider session actions', () => {
  beforeEach(() => {
    clearAllCookies()
    // An existing access token means no refresh fires on mount, so these tests
    // aren't racing the boot path.
    setCookie('authToken', 'existing', 60)
  })

  it('hydrates user from cookie on mount', () => {
    setCookie('user.v2', JSON.stringify(testUser), 60)
    const { result } = renderHookWithProviders(() => useAuth())
    expect(result.current.user?.username).toBe('sarah')
  })

  it('setAuth updates user state', () => {
    const { result } = renderHookWithProviders(() => useAuth())
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    expect(result.current.user?.username).toBe('sarah')
  })

  it('setAuth persists the auth token to a cookie', () => {
    const { result } = renderHookWithProviders(() => useAuth())
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    expect(getAuthToken()).toBe('token123')
  })

  it('setAuth persists the user to a cookie', () => {
    const { result } = renderHookWithProviders(() => useAuth())
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    expect(document.cookie).toContain('user.v2=')
  })

  it('clearAuth removes user state', () => {
    const { result } = renderHookWithProviders(() => useAuth())
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    act(() => {
      result.current.clearAuth()
    })
    expect(result.current.user).toBeNull()
  })

  it('clearAuth removes the auth token cookie', () => {
    const { result } = renderHookWithProviders(() => useAuth())
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    act(() => {
      result.current.clearAuth()
    })
    expect(getAuthToken()).toBeNull()
  })

  it('clearAuth removes the user cookie', () => {
    const { result } = renderHookWithProviders(() => useAuth())
    act(() => {
      result.current.setAuth('token123', testUser)
    })
    act(() => {
      result.current.clearAuth()
    })
    expect(document.cookie).not.toContain('user.v2=')
  })
})

describe('useAuth outside provider', () => {
  it('throws a helpful error', () => {
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/)
  })
})
