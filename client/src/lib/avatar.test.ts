import { describe, it, expect } from 'vitest'
import { getAvatarFallback, convertImageUrlToSize } from '@/lib/avatar'

describe('getAvatarFallback', () => {
  it('returns a URL containing the username and size', () => {
    const url = getAvatarFallback('sarah', 128)
    expect(url).toContain('name=sarah')
    expect(url).toContain('size=128')
    expect(url).toContain('ui-avatars.com')
  })

  it('returns undefined if not given username', () => {
    const result = getAvatarFallback(null, 128)
    expect(result).toBeUndefined()
  })

  it('returns the same color for the same username', () => {
    const a = getAvatarFallback('sarah', 128)
    const b = getAvatarFallback('sarah', 128)
    expect(a).toBe(b)
  })

  it('url-encodes special characters', () => {
    const url = getAvatarFallback('sarah jones', 128)
    expect(url).toContain('sarah%20jones')
  })
})

describe('convertImageUrlToSize', () => {
  it('inserts size transform into Cloudinary URLs', () => {
    const result = convertImageUrlToSize(
      'https://res.cloudinary.com/foo/image/upload/v1/abc.jpg',
      150,
    )
    expect(result).toContain('/upload/w_150,h_150,c_fill/')
  })

  it('returns undefined if not given username', () => {
    const result = getAvatarFallback(null, 128)
    expect(result).toBeUndefined()
  })
})
