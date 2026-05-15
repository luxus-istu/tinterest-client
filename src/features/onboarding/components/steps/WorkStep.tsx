'use client'

import {
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react'
import { useForm } from 'react-hook-form'
import type { WorkFormValues } from '@/src/features/onboarding/types/forms'
import { WorkInfoSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import StepActions from '@/src/features/onboarding/components/steps/StepActions'

interface WorkStepProps {
  defaultValues: WorkFormValues
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (values: WorkFormValues) => Promise<void>
}

export default function WorkStep({ defaultValues, isSaving, errorMessage, onBack, onSubmit }: WorkStepProps) {
  const { register, handleSubmit, setError, formState } = useForm<WorkFormValues>({
    defaultValues,
  })

  const onValidSubmit = handleSubmit(async (values) => {
    const result = WorkInfoSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <TextField isInvalid={Boolean(formState.errors.jobTitle)}>
        <Label>Должность</Label>
        <Input placeholder="Backend-разработчик" {...register('jobTitle')} />
        <FieldError>{formState.errors.jobTitle?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.department)}>
        <Label>Отдел</Label>
        <Input placeholder="Отдел разработки" {...register('department')} />
        <FieldError>{formState.errors.department?.message}</FieldError>
      </TextField>

      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
