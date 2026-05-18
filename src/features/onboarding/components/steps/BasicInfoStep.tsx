'use client'

import {
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import type { BasicInfoFormValues } from '@/src/features/onboarding/types/forms'
import { BasicInfoSchema } from '@/src/features/onboarding/types/schemas'
import { applyZodErrors } from '@/src/features/onboarding/utils/applyZodErrors'
import StepActions from '@/src/features/onboarding/components/steps/StepActions'

interface BasicInfoStepProps {
  defaultValues: BasicInfoFormValues
  isSaving: boolean
  errorMessage: string
  onSubmit: (values: BasicInfoFormValues) => Promise<void>
}

export default function BasicInfoStep({ defaultValues, isSaving, errorMessage, onSubmit }: BasicInfoStepProps) {
  const { register, handleSubmit, control, setError, formState } = useForm<BasicInfoFormValues>({
    defaultValues,
  })

  const onValidSubmit = handleSubmit(async (values) => {
    const result = BasicInfoSchema.safeParse(values)
    if (!result.success) {
      applyZodErrors(result, setError)
      return
    }
    await onSubmit(result.data)
  })

  return (
    <Form onSubmit={onValidSubmit} className="space-y-4">
      <TextField isInvalid={Boolean(formState.errors.firstName)}>
        <Label>Имя</Label>
        <Input placeholder="Алексей" {...register('firstName')} />
        <FieldError>{formState.errors.firstName?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.lastName)}>
        <Label>Фамилия</Label>
        <Input placeholder="Иванов" {...register('lastName')} />
        <FieldError>{formState.errors.lastName?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.middleName)}>
        <Label>Отчество</Label>
        <Input placeholder="Иванович" {...register('middleName')} />
        <FieldError>{formState.errors.middleName?.message}</FieldError>
      </TextField>

      <TextField isInvalid={Boolean(formState.errors.dateOfBirth)}>
        <Label>Дата рождения</Label>
        <Input type="date" {...register('dateOfBirth')} />
        <FieldError>{formState.errors.dateOfBirth?.message}</FieldError>
      </TextField>

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onChange={(value) => field.onChange(String(value))}>
            <Label>Пол</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item key="MALE" id="MALE" textValue="Мужской">
                  Мужской
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item key="FEMALE" id="FEMALE" textValue="Женский">
                  Женский
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />

      <Controller
        name="language"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onChange={(value) => field.onChange(String(value))}>
            <Label>Язык</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item key="ru" id="ru" textValue="Русский">
                  Русский
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item key="en" id="en" textValue="English">
                  English
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />

      <TextField isInvalid={Boolean(formState.errors.city)}>
        <Label>Город</Label>
        <Input placeholder="Москва" {...register('city')} />
        <FieldError>{formState.errors.city?.message}</FieldError>
      </TextField>

      <Controller
        name="about"
        control={control}
        render={({ field }) => (
          <TextField isInvalid={Boolean(formState.errors.about)}>
            <Label>О себе</Label>
            <TextArea
              rows={3}
              placeholder="Расскажите о себе"
              value={field.value ?? ''}
              onChange={field.onChange}
            />
            <FieldError>{formState.errors.about?.message}</FieldError>
          </TextField>
        )}
      />

      {formState.errors.gender?.message && <p className="text-sm text-danger">{formState.errors.gender.message}</p>}
      {formState.errors.language?.message && <p className="text-sm text-danger">{formState.errors.language.message}</p>}
      {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

      <StepActions isSaving={isSaving} />
    </Form>
  )
}
