import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { onboardingService } from '@/src/features/onboarding/services/onboarding.service'
import type {
  AboutFormValues,
  BasicInfoFormValues,
  CommunicationFormValues,
  WorkFormValues,
} from '@/src/features/onboarding/types/forms'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Не удалось выполнить запрос. Проверьте данные и попробуйте снова.'
}

export function useOnboardingQuestionnaire() {
  const [step, setStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  const [basicValues, setBasicValues] = useState<BasicInfoFormValues>({
    first_name: '',
    last_name: '',
    birth_date: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<number[]>([])
  const [workValues, setWorkValues] = useState<WorkFormValues>({
    city: '',
    job_title: '',
    department: '',
    work_format: 'OFFICE',
  })
  const [communicationValues, setCommunicationValues] = useState<CommunicationFormValues>({
    goal: 'NEW_FRIENDS',
    communication_format: ['OFFLINE'],
  })
  const [aboutValues, setAboutValues] = useState<AboutFormValues>({
    about: '',
    personality_type: 'INTROVERT',
  })

  const interestsQuery = useQuery({
    queryKey: ['onboarding-interests'],
    queryFn: onboardingService.getInterests,
    enabled: step === 2,
  })

  const basicMutation = useMutation({
    mutationFn: onboardingService.updateBasicProfile,
  })
  const avatarMutation = useMutation({
    mutationFn: onboardingService.uploadAvatar,
  })
  const interestsMutation = useMutation({
    mutationFn: onboardingService.updateInterests,
  })
  const workMutation = useMutation({
    mutationFn: onboardingService.updateWork,
  })
  const communicationMutation = useMutation({
    mutationFn: onboardingService.updateCommunication,
  })
  const completeMutation = useMutation({
    mutationFn: onboardingService.completeProfile,
  })

  const isSaving = useMemo(() => {
    if (step === 0) return basicMutation.isPending
    if (step === 1) return avatarMutation.isPending
    if (step === 2) return interestsMutation.isPending
    if (step === 3) return workMutation.isPending
    if (step === 4) return communicationMutation.isPending
    if (step === 5) return completeMutation.isPending
    return false
  }, [
    avatarMutation.isPending,
    basicMutation.isPending,
    communicationMutation.isPending,
    completeMutation.isPending,
    interestsMutation.isPending,
    step,
    workMutation.isPending,
  ])

  const goBack = () => {
    if (isSaving) return
    setErrorMessage('')
    setStep((current) => Math.max(0, current - 1))
  }

  const submitBasic = async (values: BasicInfoFormValues) => {
    setErrorMessage('')
    setBasicValues(values)

    try {
      await basicMutation.mutateAsync(values)
      setStep(1)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitAvatar = async (file: File | null) => {
    setErrorMessage('')
    setAvatarFile(file)

    try {
      if (file) {
        await avatarMutation.mutateAsync(file)
      }
      setStep(2)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitInterests = async (interestIds: number[]) => {
    setErrorMessage('')
    setSelectedInterests(interestIds)

    try {
      await interestsMutation.mutateAsync({ interest_ids: interestIds })
      setStep(3)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitWork = async (values: WorkFormValues) => {
    setErrorMessage('')
    setWorkValues(values)

    try {
      await workMutation.mutateAsync(values)
      setStep(4)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitCommunication = async (values: CommunicationFormValues) => {
    setErrorMessage('')
    setCommunicationValues(values)

    try {
      await communicationMutation.mutateAsync(values)
      setStep(5)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const submitComplete = async (values: AboutFormValues) => {
    setErrorMessage('')
    setAboutValues(values)

    try {
      await completeMutation.mutateAsync(values)
      setIsCompleted(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
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
  }
}
