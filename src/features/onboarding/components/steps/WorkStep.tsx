'use client'

import {
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import { workFormatLabels, workFormats } from '@/src/features/onboarding/constants'
import type { WorkFormValues } from '@/src/features/onboarding/types/forms'
import { workSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import { StepActions } from '@/src/features/onboarding/components/steps/StepActions'

interface WorkStepProps {
  defaultValues: WorkFormValues
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (values: WorkFormValues) => Promise<void>
}

export function WorkStep({ defaultValues, isSaving, errorMessage, onBack, onSubmit }: WorkStepProps) {
  const { register, handleSubmit, control, setError, formState } = useForm<WorkFormValues>({
    defaultValues,
  })

  const onValidSubmit = handleSubmit(async (values) => {
    const result = workSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <TextField isInvalid={Boolean(formState.errors.city)}>
        <Label>Город</Label>
        <Input placeholder="Москва" {...register('city')} />
        <FieldError>{formState.errors.city?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.job_title)}>
        <Label>Должность</Label>
        <Input placeholder="Backend-разработчик" {...register('job_title')} />
        <FieldError>{formState.errors.job_title?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.department)}>
        <Label>Отдел</Label>
        <Input placeholder="Отдел разработки" {...register('department')} />
        <FieldError>{formState.errors.department?.message}</FieldError>
      </TextField>

      <Controller
        name="work_format"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onChange={(value) => field.onChange(String(value))}>
            <Label>Формат работы</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {workFormats.map((format) => (
                  <ListBox.Item key={format} id={format} textValue={format}>
                    {workFormatLabels[format]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />

      {formState.errors.work_format?.message && (
        <p className="text-sm text-danger">{formState.errors.work_format.message}</p>
      )}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
