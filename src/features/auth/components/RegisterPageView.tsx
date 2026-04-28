'use client'

import {
  Button,
  Calendar,
  Card,
  DateField,
  DatePicker,
  Description,
  FieldError,
  Form,
  Input,
  InputOTP,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  REGEXP_ONLY_DIGITS,
  Select,
  TextField,
} from '@heroui/react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import Link from 'next/link'
import { useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'
import { useAuthActions } from '@/src/features/auth/hooks/useAuth'
import type { RegisterRequest } from '@/src/features/auth/types'
import { ApiError } from '@/src/lib/api/error'
import { useRouter } from 'next/navigation'

type RegisterStep = 'register' | 'verify' | 'verified'

export default function RegisterPageView() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      gender: 'MALE',
      language: 'ru',
      dateOfBirth: '2000-01-01',
    },
  })

  const router = useRouter()

  const {
    register: registerAction,
    verifyEmailOtp,
    resendEmailOtp,
    isRegistering,
    isVerifyingEmailOtp,
    isResendingEmailOtp,
  } = useAuthActions()

  const [step, setStep] = useState<RegisterStep>('register')
  const [registeredEmail, setRegisteredEmail] = useState<string>('')
  const [otp, setOtp] = useState('')
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    setErrorMessage(null)
    setInfoMessage(null)
    try {
      const response = await registerAction(data)
      setRegisteredEmail(response.email)
      setInfoMessage(response.message)
      setStep('verify')
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : 'OTP verification failed'
      setErrorMessage(message)
    }
  }

  const handleVerifyOtp = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const response = await verifyEmailOtp({ email: registeredEmail, code: otp })
      setSuccessMessage(response.message)
      setStep('verified')
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : 'OTP verification failed'
      setErrorMessage(message)
    }
  }

  const handleResendOtp = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const response = await resendEmailOtp({ email: registeredEmail })
      setInfoMessage(response.message)
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : 'Failed to resend OTP'
      setErrorMessage(message)
    }
  }

  const renderOtpSlots = () => (
    <>
      <InputOTP.Group>
        <InputOTP.Slot index={0} />
        <InputOTP.Slot index={1} />
        <InputOTP.Slot index={2} />
      </InputOTP.Group>
      <InputOTP.Separator />
      <InputOTP.Group>
        <InputOTP.Slot index={3} />
        <InputOTP.Slot index={4} />
        <InputOTP.Slot index={5} />
      </InputOTP.Group>
    </>
  )

  const renderHeader = () => {
    if (step === 'verify') {
      return (
        <>
          <Card.Title className="text-2xl font-black">Подтверждение почты</Card.Title>
          <Card.Description className="text-center font-medium">
            Введите 6-значный код подтверждения
          </Card.Description>
        </>
      )
    }

    if (step === 'verified') {
      return (
        <>
          <Card.Title className="text-2xl font-black">Почта подтверждена</Card.Title>
          <Card.Description className="text-center font-medium">
            Аккаунт готов к использованию.
          </Card.Description>
        </>
      )
    }

    return (
      <>
        <Card.Title className="text-2xl font-black">Регистрация</Card.Title>
        <Card.Description className="text-center font-medium">
          Присоединяйтесь к Tinterest сегодня. Заполните свои данные, чтобы начать.
        </Card.Description>
      </>
    )
  }

  const renderRegisterStep = () => (
    <Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Card.Content className="flex flex-col gap-4">
        {errorMessage && (
          <div className="bg-danger/10 text-danger rounded-lg p-3 text-center text-sm">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField isRequired isInvalid={!!errors.firstName} name="firstName">
            <Label>Имя</Label>
            <Input
              placeholder="Иван"
              variant="secondary"
              {...register('firstName', {
                required: 'Введите имя',
                minLength: { value: 2, message: 'Минимум 2 символа' },
              })}
            />
            <FieldError>{errors.firstName?.message}</FieldError>
          </TextField>
          <TextField isRequired isInvalid={!!errors.lastName} name="lastName">
            <Label>Фамилия</Label>
            <Input
              placeholder="Иванов"
              variant="secondary"
              {...register('lastName', {
                required: 'Введите фамилию',
                minLength: { value: 2, message: 'Минимум 2 символа' },
              })}
            />
            <FieldError>{errors.lastName?.message}</FieldError>
          </TextField>
        </div>

        <Controller
          control={control}
          name="gender"
          rules={{ required: true }}
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
              required: 'Введите дату рождения',
              validate: (value) => {
                if (!value) return true;
                const birthDate = parseDate(value);
                const minAgeDate = today(getLocalTimeZone()).subtract({ years: 18 });
                return birthDate.compare(minAgeDate) <= 0 || 'Вам должно быть не менее 18 лет';
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
            rules={{ required: 'Выберите язык' }}
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
          <Input
            placeholder="ivan@email.com"
            variant="secondary"
            {...register('email', {
              required: true,
              pattern: { value: /^\S+@\S+$/i, message: 'Некорректная почта' },
            })}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </TextField>

        <TextField isRequired isInvalid={!!errors.password} name="password" type="password">
          <Label>Пароль</Label>
          <Input
            placeholder="••••••••"
            variant="secondary"
            {...register('password', {
              required: true,
              minLength: { value: 8, message: 'Минимум 8 символов' },
            })}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </TextField>
      </Card.Content>
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

  const renderVerifyStep = () => (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void handleVerifyOtp()
      }}
    >
      <Card.Content className="flex flex-col gap-4">
        {errorMessage && (
          <div className="bg-danger/10 text-danger rounded-lg p-3 text-center text-sm">
            {errorMessage}
          </div>
        )}

        <div className="border-success/30 bg-success/10 rounded-xl border p-4 text-center">
          <p className="text-success/90 text-xs font-semibold tracking-wide uppercase">
            Код отправлен на почту
          </p>
          <p className="text-foreground mt-1 text-base font-bold break-all">{registeredEmail}</p>
          <p className="text-muted mt-2 text-sm">Проверьте входящие и папку «Спам»</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Label>Код подтверждения</Label>
          <Description>Подсказка для демо: используйте код 123456</Description>
          <InputOTP
            maxLength={6}
            name="otp"
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            variant="secondary"
            onChange={(value) => {
              setOtp(value)
              if (errorMessage) {
                setErrorMessage(null)
              }
            }}
          >
            {renderOtpSlots()}
          </InputOTP>
        </div>
      </Card.Content>

      <Card.Footer className="flex flex-col gap-3 pt-2">
        <Button
          className="w-full"
          size="lg"
          type="submit"
          isDisabled={otp.length !== 6 || isVerifyingEmailOtp}
        >
          Подтвердить почту
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="outline"
          isDisabled={isResendingEmailOtp}
          onPress={handleResendOtp}
        >
          Отправить код повторно
        </Button>
      </Card.Footer>
    </Form>
  )

  const renderVerifiedStep = () => (
    <Card.Content className="flex flex-col items-center gap-4 py-6 text-center">
      {(successMessage || infoMessage) && (
        <p className="text-success text-lg font-bold">{successMessage ?? infoMessage}</p>
      )}
      <Button className="w-full max-w-xs" variant="primary" onClick={() => router.push('/login')}>
        Перейти ко входу
      </Button>
    </Card.Content>
  )

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-2">
      <Card className="w-full max-w-lg shadow-xl">
        <Card.Header className="flex flex-col items-center gap-1 pb-2 text-center">
          {renderHeader()}
        </Card.Header>

        {step === 'register' && renderRegisterStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'verified' && renderVerifiedStep()}
      </Card>
    </div>
  )
}
