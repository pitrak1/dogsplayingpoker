import { authResponseSchema } from 'dogsplayingpoker-shared/user'
import { setAuthToken, setAuthUser, clearAuth } from '@/context/auth'
import { BASE_URL } from '@/constants/api'

export const requestRefresh = async (): Promise<boolean> => {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    return false
  }

  if (!res.ok) {
    clearAuth()
    return false
  }

  const result = authResponseSchema.safeParse(await res.json().catch(() => null))
  if (!result.success) return false
  
  setAuthToken(result.data.authToken)
  setAuthUser(result.data.user)
  return true
}

// If multiple requests from a single client are made and require an auth refresh,
// this makes it so only one refresh request is made and all other requests wait for it to complete before continuing
let inFlight: Promise<boolean> | null = null
export const refreshAuthToken = (): Promise<boolean> => {
  inFlight ??= requestRefresh().finally(() => { inFlight = null })
  return inFlight
}