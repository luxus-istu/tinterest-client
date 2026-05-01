import { useEffect, useMemo } from 'react'
import { useProfileStore } from '../store/profileStore'
import type { User } from '@/src/types'
import { DisplayUser, GOAL_LABELS, PERSONALITY_LABELS } from '../types'

const calculateAge = (dateOfBirth: string): number | null => {
  if (!dateOfBirth) return null
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const calculateCompletion = (user: User): number => {
  let filled = 0
  let total = 0

  const fields = ['firstName', 'lastName', 'about', 'dateOfBirth']
  fields.forEach((field) => {
    total++
    if (user[field as keyof User]) filled++
  })

  if (user.workInfo) {
    const workFields = ['city', 'job_title']
    workFields.forEach((field) => {
      total++
      if (user.workInfo![field as keyof typeof user.workInfo]) filled++
    })
  }

  total++
  if (user.interests && user.interests.length > 0) filled++

  return Math.round((filled / total) * 100)
}

export const useProfile = () => {
  const {
    user,
    isLoading,
    isSaving,
    isEditing,
    error,
    isEdited,
    fetchUser,
    saveUser,
    updateField,
    updateNestedField,
    updateAvatar,
    updateInterests,
    startEditing,
    cancelEditing,
    resetToBlank,
    clearError,
  } = useProfileStore()

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [user, fetchUser])

  const displayUser = useMemo<DisplayUser | null>(() => {
    if (!user) return null

    const age = calculateAge(user.dateOfBirth)

    return {
      fullName: `${user.lastName} ${user.firstName} ${user.middleName}`.trim(),
      age,
      avatarUrl: user.avatarUrl || '',
      city: user.workInfo?.city || '',
      job_title: user.workInfo?.job_title || '',
      about: user.about || '',
      interests: user.interests || [],
      communication_goal: user.communicationPreference?.goal
        ? GOAL_LABELS[user.communicationPreference.goal]
        : '',
      completion_percentage: calculateCompletion(user),
    }
  }, [user])

  return {
    user,
    displayUser,
    isLoading,
    isSaving,
    isEditing,
    error,
    isEdited,
    fetchUser,
    saveUser,
    updateField,
    updateWorkInfo: updateNestedField.workInfo,
    updateCommunicationPref: updateNestedField.communicationPref,
    updateAvatar,
    updateInterests,
    startEditing,
    cancelEditing,
    resetToBlank,
    clearError,
  }
}
