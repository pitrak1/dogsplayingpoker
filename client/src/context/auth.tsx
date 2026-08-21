import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { FullUser } from 'dogsplayingpoker-shared/user'
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies'
import { useQueryClient } from '@tanstack/react-query'
import { socket } from '@/socket'

const AUTH_MAX_AGE = 15 * 60
const AUTH_TOKEN_KEY = 'authToken'
const USER_KEY = 'user'

let _setUserState: ((user: FullUser | null) => void) | null = null

/* eslint-disable react-refresh/only-export-components */
export const getAuthToken = () => getCookie(AUTH_TOKEN_KEY)
export const setAuthToken = (token: string) => setCookie(AUTH_TOKEN_KEY, token, AUTH_MAX_AGE)
export const clearAuth = () => deleteCookie(AUTH_TOKEN_KEY)
export const setAuthUser = (user: FullUser) => {
  setCookie(USER_KEY, JSON.stringify(user), AUTH_MAX_AGE)
  _setUserState?.(user)
}

type AuthContextType = {
  user: FullUser | null
  setAuth: (token: string, user: FullUser) => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FullUser | null>(() => {
    const stored = getCookie(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  _setUserState = setUser
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = getCookie(AUTH_TOKEN_KEY)
    if (token && !socket.connected) {
      socket.auth = { token }
      socket.connect()
    }
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
    <AuthContext.Provider value={{ user, setAuth, clearAuth }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
