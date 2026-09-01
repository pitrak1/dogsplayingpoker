import jwt from 'jsonwebtoken'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import type { Context } from 'hono'
import { z } from 'zod'

const REFRESH_COOKIE = 'refreshToken'

const tokenPayloadSchema = z.object({ userId: z.number().int().positive() })

export const generateAuthToken = (userId: number) =>
  jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })

export const verifyAuthToken = (token: string) =>
  tokenPayloadSchema.parse(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!))

export const generateRefreshToken = (userId: number) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })

export const verifyRefreshToken = (token: string) =>
  tokenPayloadSchema.parse(jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!))

export const setRefreshCookie = (c: Context, token: string) => {
  setCookie(c, REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export const getRefreshCookie = (c: Context) => getCookie(c, REFRESH_COOKIE)
export const clearRefreshCookie = (c: Context) => deleteCookie(c, REFRESH_COOKIE)