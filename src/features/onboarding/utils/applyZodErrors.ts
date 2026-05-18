import type { Path, UseFormSetError } from 'react-hook-form'
import type { z } from 'zod'

export function applyZodErrors<T extends Record<string, unknown>>(
  result: z.ZodSafeParseError<T>,
  setError: UseFormSetError<T>
) {
  result.error.issues.forEach((issue) => {
    const field = issue.path[0]
    if (typeof field === 'string') {
      setError(field as Path<T>, {
        type: 'manual',
        message: issue.message,
      })
    }
  })
}
