import * as authContext from '@/context/auth'
import { makeUser } from '@/test/factories'
import { vi, type Mock } from 'vitest'
import type { FullUser } from 'dogsplayingpoker-shared/user'

type MockedAuth<U extends FullUser | null> = {
  user: U
  setAuth: Mock
  clearAuth: Mock
}

// Omit the user (or pass one) for a logged-in session; pass `null` for logged out.
// `ready` defaults to true because most tests exercise a settled session.
export function mockAuthContext(userOverride?: FullUser, ready?: boolean): MockedAuth<FullUser>
export function mockAuthContext(userOverride: null, ready?: boolean): MockedAuth<null>
export function mockAuthContext(userOverride?: FullUser | null, ready = true): MockedAuth<FullUser | null> {
  const user = userOverride === undefined ? makeUser() : userOverride
  const setAuth = vi.fn()
  const clearAuth = vi.fn()

  vi.spyOn(authContext, 'useAuth').mockReturnValue({
    user,
    ready,
    setAuth,
    clearAuth
  })
  return { user, setAuth, clearAuth }
}
