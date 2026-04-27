'use client'

import { Checkbox, Form, Label, ListBox, Select } from '@heroui/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  communicationFormatLabels,
  communicationFormats,
  goalLabels,
  goals,
} from '@/src/features/onboarding/constants'
import type { CommunicationFormValues } from '@/src/features/onboarding/types/forms'
import { communicationSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import { StepActions } from '@/src/features/onboarding/components/steps/StepActions'

interface CommunicationStepProps {
  defaultValues: CommunicationFormValues
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (values: CommunicationFormValues) => Promise<void>
}

export function CommunicationStep({
  defaultValues,
  isSaving,
  errorMessage,
  onBack,
  onSubmit,
}: CommunicationStepProps) {
  const { handleSubmit, control, setError, setValue, formState } =
    useForm<CommunicationFormValues>({
      defaultValues,
    })

  const selectedFormats = useWatch({
    control,
    name: 'communication_format',
  })
  const safeSelectedFormats = selectedFormats ?? []

  const toggleCommunicationFormat = (
    format: CommunicationFormValues['communication_format'][number],
    checked: boolean
  ) => {
    const nextValues = checked
      ? [...safeSelectedFormats, format]
      : safeSelectedFormats.filter((value) => value !== format)

    setValue('communication_format', nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onValidSubmit = handleSubmit(async (values) => {
    const result = communicationSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <Controller
        name="goal"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onChange={(value) => field.onChange(String(value))}>
            <Label>Цель</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {goals.map((goal) => (
                  <ListBox.Item key={goal} id={goal} textValue={goal}>
                    {goalLabels[goal]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />

      <div className="space-y-3">
        <p className="text-sm text-muted">Предпочтительный формат общения</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {communicationFormats.map((format) => {
            const checked = safeSelectedFormats.includes(format)
            return (
              <Checkbox
                key={format}
                isSelected={checked}
                onChange={(isSelected) => toggleCommunicationFormat(format, isSelected)}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>{communicationFormatLabels[format]}</Label>
                </Checkbox.Content>
              </Checkbox>
            )
          })}
        </div>
      </div>

      {formState.errors.goal?.message && <p className="text-sm text-danger">{formState.errors.goal.message}</p>}
      {formState.errors.communication_format?.message && (
        <p className="text-sm text-danger">{formState.errors.communication_format.message}</p>
      )}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
