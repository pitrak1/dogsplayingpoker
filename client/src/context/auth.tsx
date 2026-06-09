import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types/user'
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies'

const AUTH_MAX_AGE = 15 * 60
const AUTH_TOKEN_KEY = 'authToken'
const USER_KEY = 'user'

let _setUserState: ((user: User | null) => void) | null = null

export const getAuthToken = () => getCookie(AUTH_TOKEN_KEY)
export const setAuthToken = (token: string) => setCookie(AUTH_TOKEN_KEY, token, AUTH_MAX_AGE)
export const clearAuth = () => deleteCookie(AUTH_TOKEN_KEY)
export const setAuthUser = (user: User) => {
  setCookie(USER_KEY, JSON.stringify(user), AUTH_MAX_AGE)
  _setUserState?.(user)
}

type AuthContextType = {
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = getCookie(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  _setUserState = setUser

  const setAuth = (token: string, user: User) => {
    setCookie(AUTH_TOKEN_KEY, token, AUTH_MAX_AGE)
    setCookie(USER_KEY, JSON.stringify(user), AUTH_MAX_AGE)
    setUser(user)
  }

  const clearAuth = () => {
    deleteCookie(AUTH_TOKEN_KEY)
    deleteCookie(USER_KEY)
    setUser(null)
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
