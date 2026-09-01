import { getAuthToken, setAuthToken, clearAuth } from '@/context/auth'
import { refreshResponseSchema } from 'dogsplayingpoker-shared/user'

export const BASE_URL = '/api'

const fetchWithAuth = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const token = getAuthToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(input, {
    ...init,
    credentials: 'include',
    headers,
  })
}

const requestRefresh = async (): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) return false

  const result = refreshResponseSchema.safeParse(await res.json().catch(() => null))
  if (!result.success) return false
  
  setAuthToken(result.data.authToken)
  return true
}

// If multiple requests from a single client are made and require an auth refresh,
// this makes it so only one refresh request is made and all other requests wait for it to complete before continuing
let inFlight: Promise<boolean> | null = null
const refreshAuthToken = (): Promise<boolean> => {
  inFlight ??= requestRefresh().finally(() => { inFlight = null })
  return inFlight
}

// This should only be used in the api layer (api.ts) because it doesn't handle schema parsing
export const rawFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  let res = await fetchWithAuth(input, init)

  if (res.status === 401) {
    const refreshed = await refreshAuthToken()
    if (refreshed) {
      res = await fetchWithAuth(input, init)
    } else {
      clearAuth()
    }
  }

  return res
}
