import { describe, it, expect, beforeEach } from 'vitest'
import { getCookie, setCookie, deleteCookie } from '@/lib/cookies'
import { clearAllCookies } from '@/test/vitest.setup'

beforeEach(clearAllCookies)

describe('setCookie', () => {
  it('writes a cookie that can be read back', () => {
    setCookie('authToken', 'abc123', 60)
    expect(document.cookie).toContain('authToken=abc123')
  })
})

describe('getCookie', () => {
  it('reads an existing cookie value', () => {
    document.cookie = 'authToken=xyz789; path=/'
    expect(getCookie('authToken')).toBe('xyz789')
  })

  it('returns null when the cookie does not exist', () => {
    expect(getCookie('nonexistent')).toBeNull()
  })
})

describe('deleteCookie', () => {
  it('removes the cookie', () => {
    document.cookie = 'authToken=abc123; path=/'
    deleteCookie('authToken')
    expect(getCookie('authToken')).toBeNull()
  })
})