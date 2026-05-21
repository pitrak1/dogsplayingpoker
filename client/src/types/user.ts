import type { InferResponseType } from 'hono/client'
import { rpc } from '@/api/rpc'

export type User = InferResponseType<typeof rpc.api.users['by-username'][':username']['$get']>