import { useState } from 'react'
import { ZodType } from 'zod'

export function useFormValidation<T, S extends ZodType>(initial: T, schema: S) {
  const [values, setValues] = useState<T>(initial)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setFormValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const result = schema.safeParse(values)

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

  return { 
    values, 
    setValues, 
    fieldErrors, 
    setFieldErrors, 
    formError,
    setFormError,
    setFormValue,
    validate 
  }
}