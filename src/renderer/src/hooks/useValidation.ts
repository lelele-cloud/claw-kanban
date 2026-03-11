import { useState, useEffect, useCallback, useMemo } from 'react'
import type { z } from 'zod'

interface ValidationResult {
  errors: Record<string, string>
  hasErrors: boolean
  getError: (path: string) => string | undefined
}

export function useValidation<T>(schema: z.ZodType<T>, data: T): ValidationResult {
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const result = schema.safeParse(data)
    if (result.success) {
      setErrors({})
    } else {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message
        }
      })
      setErrors(fieldErrors)
    }
  }, [data, schema])

  const getError = useCallback(
    (path: string): string | undefined => errors[path],
    [errors]
  )

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors])

  return { errors, hasErrors, getError }
}
