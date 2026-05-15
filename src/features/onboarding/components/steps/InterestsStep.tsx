'use client'

import { Checkbox, Form, Label } from '@heroui/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import type { InterestsFormValues } from '@/src/features/onboarding/types/forms'
import { InterestsInfoSchema } from '@/src/features/onboarding/types/schemas'
import type { Interest } from '@/src/features/onboarding/types'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import StepActions from '@/src/features/onboarding/components/steps/StepActions'

interface InterestsStepProps {
  interestsQuery: UseQueryResult<Interest[], Error>
  defaultSelectedInterests: string[]
  isSaving: boolean
  errorMessage: string
  onBack: () => void
  onSubmit: (interestNames: string[]) => Promise<void>
}

export default function InterestsStep({
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
        interests: defaultSelectedInterests,
      },
    })

  const selectedInterests = useWatch({
    control,
    name: 'interests',
  })

  const safeSelected = selectedInterests ?? []

  const toggleInterest = (interestName: string, checked: boolean) => {
    const nextValues = checked
      ? Array.from(new Set([...safeSelected, interestName]))
      : safeSelected.filter((name) => name !== interestName)

    if (nextValues.length > 0) {
      clearErrors('interests')
    }

    setValue('interests', nextValues, { shouldValidate: true, shouldDirty: true })
  }

  const onValidSubmit = handleSubmit(async (values) => {
    const result = InterestsInfoSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data.interests)
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
          const isSelected = safeSelected.includes(interest.name)

          return (
            <Checkbox
              key={interest.id}
              isSelected={isSelected}
              onChange={(checked) => toggleInterest(interest.name, checked)}
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

      {formState.errors.interests?.message && (
        <p className="text-sm text-danger">{formState.errors.interests.message}</p>
      )}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} onBack={onBack} />
    </Form>
  )
}
