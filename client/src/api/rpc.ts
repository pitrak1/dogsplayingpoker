import { hc } from 'hono/client'
import type { AppType } from '@server/app'
import { rawFetch } from './fetch'

export const rpc = hc<AppType>('/', { fetch: rawFetch })