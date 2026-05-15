import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import useAuthStore from '@/src/features/auth/store/auth.store'
import type {
  AboutFormValues,
  BasicInfoFormValues,
  CommunicationFormValues,
  WorkFormValues,
} from '@/src/features/onboarding/types/forms'
import type { CompleteProfilePayload } from '@/src/features/onboarding/types'
import OnboardingApi from '../api/onboarding.api'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Не удалось выполнить запрос. Проверьте данные и попробуйте снова.'
}

export default function useOnboardingQuestionnaire() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [step, setStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)

  const [basicValues, setBasicValues] = useState<BasicInfoFormValues>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    language: 'ru',
    city: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [workValues, setWorkValues] = useState<WorkFormValues>({
    jobTitle: '',
    department: '',
  })
  const [communicationValues, setCommunicationValues] = useState<CommunicationFormValues>({
    goal: 'NEW_FRIENDS',
    personalityType: 'INTROVERT',
    timeSlots: [],
  })
  const [aboutValues, setAboutValues] = useState<AboutFormValues>({})

  const interestsQuery = useQuery({
    queryKey: ['onboarding-interests'],
    queryFn: OnboardingApi.getInterests,
    enabled: step === 2,
  })

  const basicMutation = useMutation({
    mutationFn: OnboardingApi.updateBasicProfile,
  })
  const avatarMutation = useMutation({
    mutationFn: OnboardingApi.uploadAvatar,
  })
  const interestsMutation = useMutation({
    mutationFn: OnboardingApi.updateInterests,
  })
  const workMutation = useMutation({
    mutationFn: OnboardingApi.updateWork,
  })
  const communicationMutation = useMutation({
    mutationFn: OnboardingApi.updateCommunication,
  })
  const completeMutation = useMutation({
    mutationFn: OnboardingApi.completeProfile,
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
      const res = await basicMutation.mutateAsync(values)
      console.log(res);
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

  const submitInterests = async (interestNames: string[]) => {
    setErrorMessage('')
    setSelectedInterests(interestNames)

    try {
      await interestsMutation.mutateAsync({ interests: interestNames })
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

    const payload: CompleteProfilePayload = {
      city: basicValues.city,
      about: values.about ?? '',
      jobTitle: workValues.jobTitle,
      department: workValues.department,
      goal: communicationValues.goal,
      personalityType: communicationValues.personalityType,
      timeSlots: communicationValues.timeSlots,
      interests: selectedInterests,
    }

    try {
      await completeMutation.mutateAsync(payload)
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        setUser({ ...currentUser, hasFilledProfile: true })
      }
      setIsCompleted(true)
      router.replace('/search')
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
