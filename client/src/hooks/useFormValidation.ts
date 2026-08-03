import { useState } from 'react'
import { ZodType } from 'zod'

export function useFormValidation<T, S extends ZodType>(initial: T, schema: S) {
  const [values, setValues] = useState<T>(initial)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setFormValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const validate = (overrides: Partial<S> = {}) => {
    const updatedValues = {...values, ...overrides}
    const result = schema.safeParse(updatedValues)

    if (result.success) {
      setFieldErrors({})
      return result
    }

    const fieldErrors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString()
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
    })
    setFieldErrors(fieldErrors)
    return result
  }

  const isValid = schema.safeParse(values).success

  return { 
    values, 
    setValues, 
    fieldErrors, 
    setFieldErrors, 
    formError,
    setFormError,
    setFormValue,
    validate,
    isValid
  }
}