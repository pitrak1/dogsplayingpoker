import { describe, it, expect, vi } from 'vitest'
import { 
  generateAuthToken, 
  generateRefreshToken, 
  verifyAuthToken, 
  verifyRefreshToken,
  setRefreshCookie,
  getRefreshCookie,
  clearRefreshCookie
} from '@/lib/auth'
import jwt from 'jsonwebtoken'
import * as honoCookie from 'hono/cookie'

vi.mock('hono/cookie')

describe('token operations', () => {
  it('generates and verifies auth tokens', () => {
    const authToken = generateAuthToken(15)
    const { userId } = verifyAuthToken(authToken)
    expect(userId).toBe(15)
  })

  it('rejects an invalid auth token', () => {
    expect(() => verifyAuthToken('not.a.real.token')).toThrow()
  })

  it('rejects an auth token signed with the wrong secret', () => {
    const wrong = jwt.sign({ userId: 15 }, 'some-other-secret')
    expect(() => verifyAuthToken(wrong)).toThrow()
  })

  it('generates and verifies refresh tokens', () => {
    const refreshToken = generateRefreshToken(15)
    const { userId } = verifyRefreshToken(refreshToken)
    expect(userId).toBe(15)
  })
})

describe('refresh cookie', () => {
  it('sets the cookie with secure flags', () => {
    const ctx = {} as any
    setRefreshCookie(ctx, 'token-value')
    expect(honoCookie.setCookie).toHaveBeenCalledWith(
      ctx,
      'refreshToken',
      'token-value',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'Strict',
        path: '/',
      }),
    )
  })

  it('reads the refresh token cookie by name', () => {
    vi.mocked(honoCookie.getCookie).mockReturnValue('the-token')
    const ctx = {} as any
    expect(getRefreshCookie(ctx)).toBe('the-token')
    expect(honoCookie.getCookie).toHaveBeenCalledWith(ctx, 'refreshToken')
  })

  it('clears the refresh token cookie', () => {
    const ctx = {} as any
    clearRefreshCookie(ctx)
    expect(honoCookie.deleteCookie).toHaveBeenCalledWith(ctx, 'refreshToken')
  })
})
