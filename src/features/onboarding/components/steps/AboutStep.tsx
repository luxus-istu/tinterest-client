'use client'

import {
  FieldError,
  Form,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import { personalityTypeLabels, personalityTypes } from '@/src/features/onboarding/constants'
import type { AboutFormValues } from '@/src/features/onboarding/types/forms'
import { completeSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import { StepActions } from '@/src/features/onboarding/components/steps/StepActions'

interface AboutStepProps {
  defaultValues: AboutFormValues
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (values: AboutFormValues) => Promise<void>
}

export function AboutStep({ defaultValues, isSaving, errorMessage, onBack, onSubmit }: AboutStepProps) {
  const { handleSubmit, control, setError, formState } = useForm<AboutFormValues>({
    defaultValues,
  })

  const onValidSubmit = handleSubmit(async (values) => {
    const result = completeSchema.safeParse(values)
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
              placeholder="Необязательно. Например: люблю горные лыжи, джаз и Rust"
              value={field.value}
              onChange={field.onChange}
            />
            <p className="text-xs text-muted">Поле необязательно.</p>
            <FieldError>{formState.errors.about?.message}</FieldError>
          </TextField>
        )}
      />

      <Controller
        name="personality_type"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onChange={(value) => field.onChange(String(value))}>
            <Label>Тип личности</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {personalityTypes.map((personalityType) => (
                  <ListBox.Item
                    key={personalityType}
                    id={personalityType}
                    textValue={personalityType}
                  >
                    {personalityTypeLabels[personalityType]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />

      {formState.errors.personality_type?.message && (
        <p className="text-sm text-danger">{formState.errors.personality_type.message}</p>
      )}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} submitLabel="Завершить" />
    </Form>
  )
}
