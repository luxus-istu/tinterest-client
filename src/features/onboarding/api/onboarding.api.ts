import { apiClient } from "@/src/lib/api";
import type { BasicProfilePayload, CommunicationPayload, CompleteProfilePayload, Interests, InterestsPayload, WorkPayload } from "../types";
import type { User } from "@/src/types";
import { UserSchema } from "@/src/types/schemes";
import { InterestsSchema } from "../types/schemas";

const OnboardingApi = {
  updateBasicProfile: (payload: BasicProfilePayload): Promise<User> =>
    apiClient.put('/profiles/me/basic', payload).then((res) => UserSchema.parseAsync(res.data)),

  uploadAvatar: (file: File): Promise<User> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/profiles/me/avatar', formData).then((res) => UserSchema.parseAsync(res.data))
  },

  getInterests: (): Promise<Interests> =>
    apiClient.get('/interests').then((res) => InterestsSchema.parseAsync(res.data)),

  updateInterests: (payload: InterestsPayload) =>
    apiClient.put('/profiles/me/interests', payload).then((res) => res.data),

  updateWork: (payload: WorkPayload) =>
    apiClient.put('/profiles/me/work', payload).then((res) => res.data),

  updateCommunication: (payload: CommunicationPayload) =>
    apiClient.put('/profiles/me/communication', payload).then((res) => res.data),

  completeProfile: (payload: CompleteProfilePayload) =>
    apiClient.put('/profiles/me/complete', payload).then((res) => res.data),
};

export default OnboardingApi;
