'use client'

import {
  Button,
  Calendar,
  Card,
  CloseButton,
  DateField,
  DatePicker,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useAuthActions } from '@/src/features/auth/hooks/useAuth'
import { RegisterRequestSchema } from '@/src/features/auth/types'
import type { RegisterRequest } from '@/src/features/auth/types'
import YandexCaptcha from "./YandexCaptcha";
import { ApiError } from '@/src/lib/api'

interface RegisterFormProps {
  onSuccess: (email: string) => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      gender: 'MALE',
      language: 'ru',
      dateOfBirth: '2000-01-01',
    },
  })

  const { register: registerAction, isRegistering } = useAuthActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [token, setToken] = useState<string>('');

  const onSubmit: SubmitHandler<RegisterRequest> = useCallback(async (data) => {
    setErrorMessage(null)
    if (token.trim().length <= 0) {
      setErrorMessage("Failed to verify captcha");
      return
    }
    try {
      const response = await registerAction(data)
      onSuccess(response.email)
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Registration failed'
      setErrorMessage(message)
    }
  }, [registerAction, onSuccess])

  return (
    <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Card.Content className="flex flex-col gap-4">
        {errorMessage && (
          <div className="relative rounded-lg bg-danger/10 p-3 pr-10 text-center text-sm text-danger">
            {errorMessage}
            <CloseButton
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onPress={() => setErrorMessage(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField isRequired isInvalid={!!errors.firstName} name="firstName">
            <Label>Имя</Label>
            <Input placeholder="Иван" variant="secondary" {...register('firstName')} />
            <FieldError>{errors.firstName?.message}</FieldError>
          </TextField>
          <TextField isRequired isInvalid={!!errors.lastName} name="lastName">
            <Label>Фамилия</Label>
            <Input placeholder="Иванов" variant="secondary" {...register('lastName')} />
            <FieldError>{errors.lastName?.message}</FieldError>
          </TextField>
        </div>

        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <RadioGroup
              isRequired
              orientation="horizontal"
              value={field.value}
              onChange={field.onChange}
            >
              <Label>Пол</Label>
              <div className="flex gap-4 pt-2">
                <Radio value="MALE">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>Мужской</Label>
                  </Radio.Content>
                </Radio>
                <Radio value="FEMALE">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>Женский</Label>
                  </Radio.Content>
                </Radio>
              </div>
            </RadioGroup>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="dateOfBirth"
            rules={{
              validate: (value) => {
                if (!value) return true
                const birthDate = parseDate(value)
                const minAgeDate = today(getLocalTimeZone()).subtract({ years: 18 })
                return birthDate.compare(minAgeDate) <= 0 || 'Вам должно быть не менее 18 лет'
              },
            }}
            render={({ field, fieldState }) => (
              <DatePicker
                isRequired
                isInvalid={fieldState.invalid}
                maxValue={today(getLocalTimeZone()).subtract({ years: 18 })}
                value={field.value ? parseDate(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toString() : '')}
              >
                <Label>Дата рождения</Label>
                <DateField.Group fullWidth variant="secondary">
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <FieldError>{fieldState.error?.message}</FieldError>
                <DatePicker.Popover>
                  <Calendar aria-label="Дата рождения">
                    <Calendar.Header>
                      <Calendar.YearPickerTrigger>
                        <Calendar.YearPickerTriggerHeading />
                        <Calendar.YearPickerTriggerIndicator />
                      </Calendar.YearPickerTrigger>
                      <Calendar.NavButton slot="previous" />
                      <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>
            )}
          />

          <Controller
            control={control}
            name="language"
            render={({ field, fieldState }) => (
              <Select
                isRequired
                isInvalid={fieldState.invalid}
                value={field.value}
                variant="secondary"
                onChange={(value) => field.onChange(value)}
              >
                <Label>Язык</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <FieldError>{fieldState.error?.message}</FieldError>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="ru" textValue="Русский">
                      Русский
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="en" textValue="English">
                      English
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </div>

        <TextField isRequired isInvalid={!!errors.email} name="email" type="email">
          <Label>Почта</Label>
          <Input placeholder="ivan@email.com" variant="secondary" {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.password} name="password" type="password">
          <Label>Пароль</Label>
          <Input placeholder="••••••••" variant="secondary" {...register('password')} />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>
      </Card.Content>
      <YandexCaptcha onSuccess={setToken} />
      <Card.Footer className="flex flex-col gap-4 pt-2">
        <Button className="w-full" size="lg" type="submit" isDisabled={isRegistering}>
          Зарегистрироваться
        </Button>
        <p className="text-muted text-center text-sm">
          Уже есть аккаунт?{' '}
          <Link className="text-accent font-medium hover:underline" href="/login">
            Войти
          </Link>
        </p>
      </Card.Footer>
    </Form>
  )
}
