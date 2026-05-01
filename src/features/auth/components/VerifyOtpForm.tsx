'use client'

import {
  Button,
  Card,
  CloseButton,
  Description,
  Form,
  InputOTP,
  Label,
  REGEXP_ONLY_DIGITS,
} from '@heroui/react'
import { useCallback, useMemo, useState } from 'react'
import { useAuthActions } from '@/src/features/auth/hooks/useAuth'
import { ApiError } from '@/src/lib/api'

interface VerifyOtpFormProps {
  email: string
  onSuccess: (message: string) => void
}

export default function VerifyOtpForm({ email, onSuccess }: VerifyOtpFormProps) {
  const { verifyEmailOtp, resendEmailOtp, isVerifyingEmailOtp, isResendingEmailOtp } = useAuthActions()
  const [otp, setOtp] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleVerifyOtp = useCallback(async () => {
    setErrorMessage(null)
    try {
      const response = await verifyEmailOtp({ email, code: otp })
      onSuccess(response.message)
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'OTP verification failed'
      setErrorMessage(message)
    }
  }, [verifyEmailOtp, email, otp, onSuccess])

  const handleResendOtp = useCallback(async () => {
    setErrorMessage(null)
    try {
      await resendEmailOtp({ email })
    } catch (err: unknown) {
      const message = err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Failed to resend OTP'
      setErrorMessage(message)
    }
  }, [resendEmailOtp, email])

  const handleOtpChange = useCallback((value: string) => {
    setOtp(value)
    setErrorMessage(null)
  }, [])

  const otpSlots = useMemo(
    () => (
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
    ),
    []
  )

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void handleVerifyOtp()
      }}
    >
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

        <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-success/90">
            Код отправлен на почту
          </p>
          <p className="mt-1 break-all text-base font-bold text-foreground">{email}</p>
          <p className="mt-2 text-sm text-muted">Проверьте входящие и папку «Спам»</p>
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
            onChange={handleOtpChange}
          >
            {otpSlots}
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
}
