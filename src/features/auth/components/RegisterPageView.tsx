'use client'

import { Card, Spinner } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import RegisterForm from './RegisterForm'
import VerifyOtpForm from './VerifyOtpForm'
import VerifiedConfirmation from './VerifiedConfirmation'
import { useAuthGuard } from '../hooks/useAuthGuard'

type RegisterStep = 'register' | 'verify' | 'verified'

export default function RegisterPageView() {
  const { isLoading } = useAuthGuard({ requireAuth: false, redirectTo: '/matching' })
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = (searchParams.get('step') as RegisterStep) || 'register'
  const initialEmail = searchParams.get('email') || ''

  const [step, setStep] = useState<RegisterStep>(initialStep)
  const [registeredEmail, setRegisteredEmail] = useState<string>(initialEmail)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (step === 'verified') {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [step, router])

  const handleRegisterSuccess = useCallback((email: string) => {
    setRegisteredEmail(email)
    setStep('verify')
  }, [])

  const handleVerifySuccess = useCallback((message: string) => {
    setSuccessMessage(message)
    setStep('verified')
  }, [])

  const header = useMemo(() => {
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
  }, [step])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-2">
      <Card className="w-full max-w-lg shadow-xl">
        <Card.Header className="flex flex-col items-center gap-1 pb-2 text-center">
          {header}
        </Card.Header>

        {step === 'register' && <RegisterForm onSuccess={handleRegisterSuccess} />}
        {step === 'verify' && <VerifyOtpForm email={registeredEmail} onSuccess={handleVerifySuccess} />}
        {step === 'verified' && <VerifiedConfirmation message={successMessage} />}
      </Card>
    </div>
  )
}
