import { Hono } from 'hono'
import { getUploadSignature } from '@/adapters/cloudinary'
import type { AuthedEnv } from '../types'

export const mediaRoutes = new Hono<AuthedEnv>()
  .get('/upload-signature', (c) => {
    return c.json(getUploadSignature())
  })
