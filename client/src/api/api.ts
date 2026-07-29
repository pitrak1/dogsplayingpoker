import { rawFetch } from './fetch'

const BASE = '/api'

export const api = {
  get: (path: string, params?: Record<string, string>) => {
    const url = new URL(`${BASE}${path}`, window.location.origin)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    return rawFetch(url.toString())
  },
  post: (path: string, body?: unknown) =>
    rawFetch(`${BASE}${path}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (path: string, body?: unknown) =>
    rawFetch(`${BASE}${path}`, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: unknown) =>
    rawFetch(`${BASE}${path}`, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
}
