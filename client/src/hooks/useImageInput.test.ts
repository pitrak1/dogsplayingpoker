import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useImageInput } from './useImageInput'

const fileChangeEvent = (files: File[]) =>
  ({ target: { files } }) as unknown as React.ChangeEvent<HTMLInputElement>

describe('useImageInput', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('creates object URL when a file is set', () => {
    const { result } = renderHook(() => useImageInput())
    const file = new File(['dummy'], 'rex.jpg', { type: 'image/jpeg' })
    act(() => result.current.onChange(fileChangeEvent([file])))
    expect(result.current.file).toBe(file)
    expect(result.current.fileUrl).toMatch(/^blob:/)
  })

  it('revokes prior URL when a new file replaces it', () => {
    const spy = vi.spyOn(URL, 'revokeObjectURL')
    const { result } = renderHook(() => useImageInput())
    const file1 = new File(['dummy'], 'rex.jpg', { type: 'image/jpeg' })
    const file2 = new File(['dummy2'], 'rex2.jpg', { type: 'image/jpeg' })
    act(() => result.current.onChange(fileChangeEvent([file1])))
    const url1 = result.current.fileUrl
    act(() => result.current.onChange(fileChangeEvent([file2])))
    expect(spy).toHaveBeenCalledWith(url1)
  })

  it('revokes URL on unmount', () => {
    const spy = vi.spyOn(URL, 'revokeObjectURL')
    const { result, unmount } = renderHook(() => useImageInput())
    const file = new File(['dummy'], 'rex.jpg', { type: 'image/jpeg' })
    act(() => result.current.onChange(fileChangeEvent([file])))
    const url = result.current.fileUrl
    unmount()
    expect(spy).toHaveBeenCalledWith(url)
  })
})