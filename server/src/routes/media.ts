import { Hono } from 'hono'
import { getUploadSignature } from '@/services/cloudinary'
import type { AppEnv } from '../types'

export const mediaRoutes = new Hono<AppEnv>()
  .get('/upload-signature', (c) => {
    return c.json(getUploadSignature())
  })