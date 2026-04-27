'use client'

import { FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { useForm } from 'react-hook-form'
import type { BasicInfoFormValues } from '@/src/features/onboarding/types/forms'
import { basicInfoSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import { StepActions } from '@/src/features/onboarding/components/steps/StepActions'

interface BasicInfoStepProps {
  defaultValues: BasicInfoFormValues
  isSaving: boolean
  errorMessage: string
  onSubmit: (values: BasicInfoFormValues) => Promise<void>
}

export function BasicInfoStep({ defaultValues, isSaving, errorMessage, onSubmit }: BasicInfoStepProps) {
  const { register, handleSubmit, setError, formState } = useForm<BasicInfoFormValues>({
    defaultValues,
  })

  const onValidSubmit = handleSubmit(async (values) => {
    const result = basicInfoSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <TextField isInvalid={Boolean(formState.errors.first_name)}>
        <Label>Имя</Label>
        <Input placeholder="Алексей" {...register('first_name')} />
        <FieldError>{formState.errors.first_name?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.last_name)}>
        <Label>Фамилия</Label>
        <Input placeholder="Иванов" {...register('last_name')} />
        <FieldError>{formState.errors.last_name?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.birth_date)}>
        <Label>Дата рождения</Label>
        <Input type="date" {...register('birth_date')} />
        <FieldError>{formState.errors.birth_date?.message}</FieldError>
      </TextField>

      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
      <StepActions isSaving={isSaving} />
    </Form>
  )
}
