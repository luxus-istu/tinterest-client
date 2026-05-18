import { apiClient } from '@/src/lib/api/client'
import type { AdminStatistics, AdminUsersPage, Interest } from '../types'

export const adminApi = {
  getUsers: (params?: {
    email?: string
    page?: number
    size?: number
    sort?: string[]
  }): Promise<AdminUsersPage> =>
    apiClient.get('/admin/users', { params }).then((res) => res.data as AdminUsersPage),

  blockUser: (userId: number): Promise<void> =>
    apiClient.post(`/admin/users/${userId}/block`).then(() => undefined),

  unblockUser: (userId: number): Promise<void> =>
    apiClient.post(`/admin/users/${userId}/unblock`).then(() => undefined),

  getStatistics: (): Promise<AdminStatistics> =>
    apiClient.get('/admin/statistics').then((res) => res.data as AdminStatistics),

  addInterest: (name: string): Promise<Interest> =>
    apiClient.post('/admin/interests/add', { name }).then((res) => res.data as Interest),

  deleteInterest: (interestId: number): Promise<void> =>
    apiClient.delete(`/admin/interests/delete/${interestId}`).then(() => undefined),

  getInterests: (): Promise<Interest[]> =>
    apiClient.get('/interests').then((res) => res.data as Interest[]),
}
