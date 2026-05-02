export interface MatchingProfile {
  id: number
  firstName: string
  lastName: string
  age: number
  city: string
  avatarUrl: string
  about: string
  jobTitle: string
  department: string
  workFormat: string
  goal: string
  personalityType: string
  communicationFormat: string[]
  interests: { name: string; level: number }[]
  photos: string[]
}

export interface MatchingFilter {
  id: string
  label: string
}
