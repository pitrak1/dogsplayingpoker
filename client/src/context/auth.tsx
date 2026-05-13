import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types/user'
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies'

const ACCESS_TOKEN_LIFETIME = 15 * 60

export const getAuthToken = () => getCookie('authToken')
export const setAuthToken = (token: string) => setCookie('authToken', token, ACCESS_TOKEN_LIFETIME)
export const clearAuth = () => deleteCookie('authToken')

type AuthContextType = {
  user: User | null
  setAuthToken: (token: string) => void
  clearAuth: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const setAuthToken = (token: string) => {
    setCookie('authToken', token, ACCESS_TOKEN_LIFETIME)
  }

  const clearAuth = () => {
    deleteCookie('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setAuthToken, clearAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}