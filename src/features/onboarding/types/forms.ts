export interface BasicInfoFormValues {
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  language: 'ru' | 'en'
  city: string
  about?: string
}

export interface InterestsFormValues {
  interests: string[]
}

export interface WorkFormValues {
  jobTitle: string
  department: string
}

export interface CommunicationFormValues {
  goal: string
  personalityType: string
  timeSlots: string[]
}

export interface AboutFormValues {
  about?: string
}
