import * as authContext from '@/context/auth'
import { makeUser } from '@/test/factories'
import { vi } from 'vitest'
import type { FullUser } from 'dogsplayingpoker-shared/user'

export const mockAuthContext = (userOverride?: FullUser) => {
  const user = userOverride ?? makeUser()
  const setAuth = vi.fn()
  const clearAuth = vi.fn()
  
  vi.spyOn(authContext, 'useAuth').mockReturnValue({
    user,
    setAuth,
    clearAuth
  })
  return { user, setAuth, clearAuth }
}