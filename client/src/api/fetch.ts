import { getAuthToken, setAuthToken, clearAuth } from '@/context/auth'

const BASE_URL = '/api'

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

const refreshAuthToken = async (): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) return false
  const data = await res.json()
  setAuthToken(data.authToken)
  return true
}

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
