import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fullUserSchema, type FullUser } from 'dogsplayingpoker-shared/user'
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies'
import { useQueryClient } from '@tanstack/react-query'
import { socket } from '@/socket'
import { refreshAuthToken } from '@/api/refresh'

const AUTH_MAX_AGE = 15 * 60
const AUTH_TOKEN_KEY = 'authToken'
const USER_KEY = 'user.v2'

let _setUserState: ((user: FullUser | null) => void) | null = null

/* eslint-disable react-refresh/only-export-components */
export const getAuthToken = () => getCookie(AUTH_TOKEN_KEY)
export const setAuthToken = (token: string) => setCookie(AUTH_TOKEN_KEY, token, AUTH_MAX_AGE)
export const clearAuth = () => {
  deleteCookie(AUTH_TOKEN_KEY)
  deleteCookie(USER_KEY)
  _setUserState?.(null)
}
export const setAuthUser = (user: FullUser) => {
  setCookie(USER_KEY, JSON.stringify(user), AUTH_MAX_AGE)
  _setUserState?.(user)
}

const readStoredUser = (): FullUser | null => {
  const stored = getCookie(USER_KEY)
  if (!stored) return null
  try { 
    const result = fullUserSchema.safeParse(JSON.parse(stored))
    if (result.success) return result.data
  } catch {
    // Malformed json, ignore and return null
  }
  
  // We only delete the cookie if it was garbage anyway
  deleteCookie(USER_KEY)
  return null
}

type AuthContextType = {
  user: FullUser | null
  ready: boolean
  setAuth: (token: string, user: FullUser) => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FullUser | null>(readStoredUser)
  const [ready, setReady] = useState(() => !!getCookie(AUTH_TOKEN_KEY))
  _setUserState = setUser
  const queryClient = useQueryClient()

  // The ready flag indicates whether we are done finding out if we have a token or not
  // This effect makes it so when the app first loads, we follow one of two paths:
  // 1. If we have a token, we connect the socket immediately
  // 2. If we don't have a token, we attempt to refresh it and then connect the socket if successful
  useEffect(() => {
    const connectSocket = () => {
      const token = getCookie(AUTH_TOKEN_KEY)
      if (token && !socket.connected) {
        socket.auth = { token }
        socket.connect()
      }
    }

    if (getCookie(AUTH_TOKEN_KEY)) {
      connectSocket()
      return
    }
    
    refreshAuthToken()
      .then(connectSocket)
      .finally(() => setReady(true))
  }, [])

  const setAuth = (token: string, user: FullUser) => {
    setCookie(AUTH_TOKEN_KEY, token, AUTH_MAX_AGE)
    setCookie(USER_KEY, JSON.stringify(user), AUTH_MAX_AGE)
    setUser(user)
    socket.auth = { token }
    socket.connect()
  }

  const clearAuth = () => {
    deleteCookie(AUTH_TOKEN_KEY)
    deleteCookie(USER_KEY)
    setUser(null)
    queryClient.clear()
    socket.disconnect()
  }

  return (
    <AuthContext.Provider value={{ user, ready, setAuth, clearAuth }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
