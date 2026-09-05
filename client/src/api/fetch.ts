import { getAuthToken } from '@/context/auth'
import { refreshAuthToken } from '@/api/refresh'

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
    }
  }

  return res
}
