import type { User, Interest } from '@/src/types'

export type { User, ErrorResponse, WorkInfo, CommunicationPreference, Interest } from '@/src/types'

export type ProfileFormData = {
  firstName: string
  lastName: string
  middle_name: string
  about: string
  date_of_birth: string
  gender: 'MALE' | 'FEMALE' | ''
  language: 'ru' | 'en' | ''
}

export type DisplayUser = {
  fullName: string
  age: number | null
  avatarUrl: string
  city: string
  job_title: string
  about: string
  interests: Interest[]
  communication_goal: string
  completion_percentage: number
}

export const GOAL_LABELS: Record<string, string> = {
  NEW_FRIENDS: 'Новые друзья',
  RELATIONSHIP: 'Отношения',
  NETWORKING: 'Нетворкинг',
}

export const PERSONALITY_LABELS: Record<string, string> = {
  INTROVERT: 'Интроверт',
  EXTROVERT: 'Экстраверт',
  AMBIVERT: 'Амбиверт',
}

export const WORK_FORMAT_LABELS: Record<string, string> = {
  OFFICE: 'Офис',
  REMOTE: 'Удаленно',
  HYBRID: 'Гибрид',
}

//blank значения для заполнения профиля
export const BLANK_USER: Partial<User> = {
  id: 0,
  firstName: '',
  lastName: '',
  middleName: '',
  dateOfBirth: '',
  gender: 'MALE',
  language: 'ru',
  email: '',
  about: '',
  avatarUrl: '/assets/default-avatar.jpg',
  hasFilledProfile: false,
  role: 'USER',
  blocked: false,
  emailVerified: false,
  workInfo: {
    id: 0,
    city: '',
    job_title: '',
    department: '',
    work_format: 'OFFICE',
  },
  communicationPreference: {
    id: 0,
    goal: 'NEW_FRIENDS',
    personality_type: 'AMBIVERT',
    communication_format: ['ONLINE'],
  },
  interests: [],
}
