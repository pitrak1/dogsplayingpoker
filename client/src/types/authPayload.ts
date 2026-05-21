import type { InferResponseType } from 'hono/client'
import { rpc } from '@/api/rpc'

export type AuthPayload = InferResponseType<typeof rpc.api.auth.login['$post']>