import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { useFormValidation } from './useFormValidation'
import { renderHookWithProviders } from '@/test/wrapper'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().int().positive(),
})

describe('useFormValidation', () => {
  it('validate returns success when values are valid', async () => {
    const { result } = renderHook(() =>
      useFormValidation({ name: 'Rex', age: 3 }, schema),
    )
    act(() => result.current.validate())
    expect(result.current.fieldErrors).toEqual({})
    expect(result.current.formError).toBeNull()
  })

  it('validate populates field errors', async () => {
    const { result } = renderHook(() =>
      useFormValidation({ name: '', age: -1 }, schema),
    )
    act(() => result.current.validate())
    expect(result.current.fieldErrors.name).toBe('Name is required')
    expect(result.current.fieldErrors.age).toBeDefined()
  })

  it('setFormValue updates a single field', async () => {
    const { result } = renderHook(() =>
      useFormValidation({ name: '', age: 0 }, schema),
    )
    act(() => { result.current.setFormValue('name', 'Rex') })
    expect(result.current.values.name).toBe('Rex')
  })

  it('successful validate clears prior field errors', async () => {
    const { result } = renderHook(() =>
      useFormValidation({ name: '', age: -1 }, schema),
    )
    act(() => result.current.validate())
    expect(result.current.fieldErrors.name).toBe('Name is required')
    act(() => {
      result.current.setFormValue('name', 'Rex')
      result.current.setFormValue('age', 2) 
    })
    act(() => result.current.validate())
    expect(result.current.fieldErrors.name).toBeUndefined()
  })
})