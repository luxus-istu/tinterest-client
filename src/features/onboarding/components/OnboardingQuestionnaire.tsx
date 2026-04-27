'use client'

import { stepTitles } from '@/src/features/onboarding/constants'
import { CompletionState } from '@/src/features/onboarding/components/CompletionState'
import { AboutStep } from '@/src/features/onboarding/components/steps/AboutStep'
import { AvatarStep } from '@/src/features/onboarding/components/steps/AvatarStep'
import { BasicInfoStep } from '@/src/features/onboarding/components/steps/BasicInfoStep'
import { CommunicationStep } from '@/src/features/onboarding/components/steps/CommunicationStep'
import { InterestsStep } from '@/src/features/onboarding/components/steps/InterestsStep'
import { WorkStep } from '@/src/features/onboarding/components/steps/WorkStep'
import useOnboardingQuestionnaire from '@/src/features/onboarding/hooks/useOnboardingQuestionnaire'

const stepsCount = stepTitles.length

export default function OnboardingQuestionnaire() {
  const {
    step,
    isCompleted,
    isSaving,
    errorMessage,
    interestsQuery,
    basicValues,
    avatarFile,
    selectedInterests,
    workValues,
    communicationValues,
    aboutValues,
    goBack,
    submitBasic,
    submitAvatar,
    submitInterests,
    submitWork,
    submitCommunication,
    submitComplete,
  } = useOnboardingQuestionnaire()

  if (isCompleted) {
    return <CompletionState />
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-3 py-6 sm:px-4 sm:py-12">
      <section className="w-full rounded-2xl border border-border bg-surface p-4 shadow-sm sm:rounded-3xl sm:p-8">
        <div className="mb-5 sm:mb-6">
          <p className="text-sm text-muted">
            Шаг {step + 1} из {stepsCount}
          </p>
          <h1 className="mt-2 text-xl font-semibold sm:text-3xl">{stepTitles[step]}</h1>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-secondary sm:mt-4">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${((step + 1) / stepsCount) * 100}%` }}
            />
          </div>
        </div>

        {step === 0 && (
          <BasicInfoStep
            defaultValues={basicValues}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={submitBasic}
          />
        )}
        {step === 1 && (
          <AvatarStep
            defaultFile={avatarFile}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onBack={goBack}
            onSubmit={submitAvatar}
          />
        )}
        {step === 2 && (
          <InterestsStep
            interestsQuery={interestsQuery}
            defaultSelectedInterests={selectedInterests}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onBack={goBack}
            onSubmit={submitInterests}
          />
        )}
        {step === 3 && (
          <WorkStep
            defaultValues={workValues}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onBack={goBack}
            onSubmit={submitWork}
          />
        )}
        {step === 4 && (
          <CommunicationStep
            defaultValues={communicationValues}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onBack={goBack}
            onSubmit={submitCommunication}
          />
        )}
        {step === 5 && (
          <AboutStep
            defaultValues={aboutValues}
            isSaving={isSaving}
            errorMessage={errorMessage}
            onBack={goBack}
            onSubmit={submitComplete}
          />
        )}
      </section>
    </main>
  )
}
