import type {
  BasicProfilePayload,
  CommunicationPayload,
  CompleteProfilePayload,
  Interest,
  InterestsPayload,
  WorkPayload,
} from '@/src/features/onboarding/types/types'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const mockInterests: Interest[] = [
  { id: 1, name: 'Музыка' },
  { id: 2, name: 'Путешествия' },
  { id: 3, name: 'Кино' },
  { id: 4, name: 'Программирование' },
  { id: 5, name: 'Спорт' },
  { id: 6, name: 'Искусство' },
]

export const onboardingService = {
  updateBasicProfile: async (_payload: BasicProfilePayload) => {
    void _payload
    // await apiClient.patch('/profile/me', payload)
    await wait(400)
  },

  uploadAvatar: async (_file: File) => {
    void _file
    // const formData = new FormData()
    // formData.append('avatar', file)
    // await apiClient.post('/profile/me/avatar', formData)
    await wait(500)
  },

  getInterests: async () => {
    // const response = await apiClient.get<Interest[]>('/interests')
    // return response.data
    await wait(300)
    return mockInterests
  },

  updateInterests: async (_payload: InterestsPayload) => {
    void _payload
    // await apiClient.patch('/profile/me', payload)
    await wait(400)
  },

  updateWork: async (_payload: WorkPayload) => {
    void _payload
    // await apiClient.put('/profile/me/work', payload)
    await wait(400)
  },

  updateCommunication: async (_payload: CommunicationPayload) => {
    void _payload
    // await apiClient.put('/profile/me/communication', payload)
    await wait(400)
  },

  completeProfile: async (_payload: CompleteProfilePayload) => {
    void _payload
    // await apiClient.patch('/profile/me/complete', payload)
    await wait(500)
  },
}
