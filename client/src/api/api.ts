import { rawFetch, BASE_URL } from './fetch'
import { ApiError } from './errors'
import { apiErrorSchema } from 'dogsplayingpoker-shared/error'
import { z } from 'zod'

const request = async <T extends z.ZodType>(
  schema: T,
  path: string,
  init?: RequestInit,
): Promise<z.infer<T>> => {
  const response = await rawFetch(path, init)

  if (!response.ok) {
    // Read as text first: not every error is JSON (ex: a 502 HTML page from Railway),
    // and response.json() would discard the body we want to log.
    const text = await response.text().catch(() => '')

    let body: unknown = null
    try { body = JSON.parse(text) } catch { /* not JSON — handled below */ }

    const { success, data } = apiErrorSchema.safeParse(body)
    if (success) throw new ApiError(data.message, data.field)

    console.error(`Unparseable error body (${response.status}):`, text.slice(0, 200))
    throw new ApiError(`Request failed (${response.status})`)
  }

  return schema.parse(await response.json())
}

export const api = {
  get: <T extends z.ZodType>(schema: T, path: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request(schema, `${BASE_URL}${path}${query}`)
  },
  post: <T extends z.ZodType>(schema: T, path: string, body?: unknown) =>
    request(schema, `${BASE_URL}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T extends z.ZodType>(schema: T, path: string, body?: unknown) =>
    request(schema, `${BASE_URL}${path}`, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T extends z.ZodType>(schema: T, path: string, body?: unknown) =>
    request(schema, `${BASE_URL}${path}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
}
