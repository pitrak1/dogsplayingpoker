import { Hono } from 'hono'
import { getUploadSignature } from '@/services/cloudinary'
import type { AuthedEnv } from '../types'

export const mediaRoutes = new Hono<AuthedEnv>()
  .get('/upload-signature', (c) => {
    return c.json(getUploadSignature())
  })