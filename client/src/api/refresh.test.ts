import { describe, it, expect, beforeEach } from 'vitest'
import { refreshAuthToken } from '@/api/refresh'
import { getAuthToken } from '@/context/auth'
import { clearAllCookies, mockFetch, jsonResponse } from '@/test/vitest.setup'
import { makeUser } from '@/test/factories'
import { setCookie } from '@/lib/cookies'

describe('refreshAuthToken', () => {
  beforeEach(clearAllCookies)

  it('collapses concurrent refresh calls into one request', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ authToken: 'fresh', user: makeUser() }))
    const results = await Promise.all([refreshAuthToken(), refreshAuthToken(), refreshAuthToken()])
    expect(results).toEqual([true, true, true])
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('allows a new request after the previous one settles', async () => {
    await refreshAuthToken()
    await refreshAuthToken()
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it('stores the new auth token and user on success', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ authToken: 'fresh', user: makeUser() }))
    expect(await refreshAuthToken()).toBe(true)
    expect(getAuthToken()).toBe('fresh')
    expect(document.cookie).toContain('user.v2=')
  })

  it('clears the session when the server rejects the refresh', async () => {
    setCookie('authToken', 'stale', 60)
    setCookie('user.v2', JSON.stringify(makeUser()), 60)
    expect(await refreshAuthToken()).toBe(false)
    expect(getAuthToken()).toBeNull()
    expect(document.cookie).not.toContain('user.v2=')
  })

  it('leaves the session alone when the request fails to send', async () => {
    setCookie('authToken', 'stale', 60)
    mockFetch.mockRejectedValueOnce(new TypeError('network down'))
    expect(await refreshAuthToken()).toBe(false)
    expect(getAuthToken()).toBe('stale')
  })
})
