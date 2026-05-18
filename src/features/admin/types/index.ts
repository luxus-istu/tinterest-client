export type AdminUserSummary = {
  id: number
  firstName: string
  lastName: string
  email: string
  blocked: boolean
  createdAt: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
}

export type AdminUsersPage = {
  content: AdminUserSummary[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  empty: boolean
}

export type AdminStatistics = {
  totalUsers: number
  totalMatches: number
  registrationDynamics: {
    lastDay: number
    lastWeek: number
    lastMonth: number
  }
  genderDistribution: Record<string, number>
  topCities: Record<string, number>
  topInterests: Record<string, number>
}

export type Interest = {
  id: number
  name: string
}
