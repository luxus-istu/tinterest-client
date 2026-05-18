import { apiClient } from "@/src/lib/api/client"
import type { ProfileResponse } from "@/src/types"

export const profileApi = {
  getMe: (): Promise<ProfileResponse> =>
    apiClient.get("/profiles/me").then((res) => res.data),

  getById: (userId: number): Promise<ProfileResponse> =>
    apiClient.get(`/profiles/${userId}`).then((res) => res.data),
}
