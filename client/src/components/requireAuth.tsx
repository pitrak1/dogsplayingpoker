import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/context/auth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return null   // or a spinner
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}