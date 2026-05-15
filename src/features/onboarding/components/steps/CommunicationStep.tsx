'use client'

import { Checkbox, Form, Label, ListBox, Select } from '@heroui/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  goalLabels,
  goals,
  personalityTypeLabels,
  personalityTypes,
  timeSlotLabels,
  timeSlots,
} from '@/src/features/onboarding/constants'
import type { CommunicationFormValues } from '@/src/features/onboarding/types/forms'
import { CommunicationInfoSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import StepActions from '@/src/features/onboarding/components/steps/StepActions'

interface CommunicationStepProps {
  defaultValues: CommunicationFormValues
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (values: CommunicationFormValues) => Promise<void>
}

export default function CommunicationStep({
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

  const selectedSlots = useWatch({
    control,
    name: 'timeSlots',
  })
  const safeSelectedSlots = selectedSlots ?? []

  const toggleTimeSlot = (slot: string, checked: boolean) => {
    const nextValues = checked
      ? [...safeSelectedSlots, slot]
      : safeSelectedSlots.filter((value) => value !== slot)

    setValue('timeSlots', nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onValidSubmit = handleSubmit(async (values) => {
    const result = CommunicationInfoSchema.safeParse(values)
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

      <Controller
        name="personalityType"
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

      <div className="space-y-3">
        <p className="text-sm text-muted">Предпочтительное время для общения</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {timeSlots.map((slot) => {
            const checked = safeSelectedSlots.includes(slot)
            return (
              <Checkbox
                key={slot}
                isSelected={checked}
                onChange={(isSelected) => toggleTimeSlot(slot, isSelected)}
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>{timeSlotLabels[slot]}</Label>
                </Checkbox.Content>
              </Checkbox>
            )
          })}
        </div>
      </div>

      {formState.errors.goal?.message && <p className="text-sm text-danger">{formState.errors.goal.message}</p>}
      {formState.errors.personalityType?.message && (
        <p className="text-sm text-danger">{formState.errors.personalityType.message}</p>
      )}
      {formState.errors.timeSlots?.message && (
        <p className="text-sm text-danger">{formState.errors.timeSlots.message}</p>
      )}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
