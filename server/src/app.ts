import { Hono } from 'hono'
import { authMiddleware } from './middleware/auth'
import { mediaRoutes } from './routes/media'
import { userRoutes } from './routes/users'
import { authRoutes } from './routes/auth'
import { petRoutes } from './routes/pets'
import type { AppEnv } from './types'

const apiRoutes = new Hono<AppEnv>()
  .use(authMiddleware)
  .get('/health', (c) => c.json({ ok: true }))
  .route('/auth', authRoutes)
  .route('/users', userRoutes)
  .route('/media', mediaRoutes)
  .route('/pets', petRoutes)


export const app = new Hono<AppEnv>().route('/api', apiRoutes)
export type AppType = typeof app
