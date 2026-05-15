'use client'

import {
  FieldError,
  Form,
  Label,
  TextArea,
  TextField,
} from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import type { AboutFormValues } from '@/src/features/onboarding/types/forms'
import { CompleteInfoSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import StepActions from '@/src/features/onboarding/components/steps/StepActions'

interface AboutStepProps {
  defaultValues: AboutFormValues
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (values: AboutFormValues) => Promise<void>
}

export default function AboutStep({ defaultValues, isSaving, errorMessage, onBack, onSubmit }: AboutStepProps) {
  const { handleSubmit, control, setError, formState } = useForm<AboutFormValues>({
    defaultValues,
  })

  const onValidSubmit = handleSubmit(async (values) => {
    const result = CompleteInfoSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <Controller
        name="about"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={Boolean(formState.errors.about)}>
            <Label>О себе</Label>
            <TextArea
              rows={5}
              placeholder="Расскажите о себе. Например: люблю горные лыжи, джаз и Rust"
              value={field.value ?? ''}
              onChange={field.onChange}
            />
            <p className="text-xs text-muted">Поле необязательно.</p>
            <FieldError>{formState.errors.about?.message}</FieldError>
          </TextField>
        )}
      />

      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} submitLabel="Завершить" />
    </Form>
  )
}
