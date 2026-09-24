import { beforeEach } from 'vitest'
import { resetRedis } from './helpers'

// Rate limit counters outlive a test otherwise, so the second test to touch an
// endpoint would start partway through its window. Applies to every test file.
beforeEach(resetRedis)
