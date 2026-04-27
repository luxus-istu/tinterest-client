'use client'

import { Checkbox, Form, Label } from '@heroui/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import type { InterestsFormValues } from '@/src/features/onboarding/types/forms'
import { interestsSchema } from '@/src/features/onboarding/types/schemas'
import type { Interest } from '@/src/features/onboarding/types/types'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import { StepActions } from '@/src/features/onboarding/components/steps/StepActions'

interface InterestsStepProps {
  interestsQuery: UseQueryResult<Interest[], Error>
  defaultSelectedInterests: number[]
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (interestIds: number[]) => Promise<void>
}

export function InterestsStep({
  interestsQuery,
  defaultSelectedInterests,
  isSaving,
  errorMessage,
  onBack,
  onSubmit,
}: InterestsStepProps) {
  const { handleSubmit, setValue, setError, clearErrors, formState, control } =
    useForm<InterestsFormValues>({
      defaultValues: {
        interest_ids: defaultSelectedInterests,
      },
    })

  const selectedIds = useWatch({
    control,
    name: 'interest_ids',
  })

  const safeSelectedIds = selectedIds ?? []

  const toggleInterest = (interestId: number, checked: boolean) => {
    const nextValues = checked
      ? Array.from(new Set([...safeSelectedIds, interestId]))
      : safeSelectedIds.filter((id) => id !== interestId)

    if (nextValues.length > 0) {
      clearErrors('interest_ids')
    }

    setValue('interest_ids', nextValues, { shouldValidate: true, shouldDirty: true })
  }

  const onValidSubmit = handleSubmit(async (values) => {
    const result = interestsSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data.interest_ids)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <p className="text-sm text-muted">Выберите интересы, которые вам подходят.</p>
      {interestsQuery.isLoading && <p className="text-sm text-muted">Загружаем интересы...</p>}
      {interestsQuery.isError && (
        <p className="text-sm text-danger">Не удалось загрузить интересы.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {interestsQuery.data?.map((interest) => {
          const isSelected = safeSelectedIds.includes(interest.id)

          return (
            <Checkbox
              key={interest.id}
              isSelected={isSelected}
              onChange={(checked) => toggleInterest(interest.id, checked)}
            >
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>{interest.name}</Label>
              </Checkbox.Content>
            </Checkbox>
          )
        })}
      </div>

      {formState.errors.interest_ids?.message && (
        <p className="text-sm text-danger">{formState.errors.interest_ids.message}</p>
      )}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
