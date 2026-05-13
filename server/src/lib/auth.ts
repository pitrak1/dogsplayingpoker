import jwt from 'jsonwebtoken'
import { YogaInitialContext } from 'graphql-yoga'

export const generateAuthToken = (userId: number) =>
  jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })

export const verifyAuthToken = (token: string) : { userId: number} =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as unknown as { userId: number }

export const generateRefreshToken = (userId: number) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })

export const verifyRefreshToken = (token: CookieListItem) : { userId: number} =>
  jwt.verify(token!.value!, process.env.REFRESH_TOKEN_SECRET!) as unknown as { userId: number }

export const setRefreshTokenCookie = async (ctx: YogaInitialContext, refreshToken: string) => {
  await ctx.request.cookieStore?.set({
    name: 'refreshToken',
    value: refreshToken,
    domain: null,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    path: '/',
  })
}

export const getRefreshTokenFromCookies = async (ctx: YogaInitialContext) => 
  await ctx.request.cookieStore?.get('refreshToken')