import { config } from 'dotenv'
import { resolve } from 'node:path'

// Kept in its own setup file, listed first in vitest.config.ts. Imports are hoisted
// within a module, so anything importing the app (and through it the Redis-backed
// limiters) from the same file as this call would evaluate before REDIS_URL is set.
config({ path: resolve(__dirname, '../../.env.test') })
