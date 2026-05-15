'use client'

import OnboardingQuestionnaire from '@/src/features/onboarding/components/OnboardingQuestionnaire'
import { useAuthGuard } from '@/src/features/auth/hooks/useAuthGuard'
import { Spinner } from '@heroui/react'

export default function OnboardingPage() {
  const { isLoading } = useAuthGuard({ requireAuth: true, requireProfile: false })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return <OnboardingQuestionnaire />
}
