import { apiClient } from "@/src/lib/api";
import type {
  BasicProfilePayload,
  CommunicationPayload,
  Interests,
  InterestsPayload,
  WorkPayload,
} from "@/src/features/onboarding/types";
import type { User } from "@/src/types";
import { UserSchema } from "@/src/types/schemes";
import { InterestsSchema } from "@/src/features/onboarding/types/schemas";

export const profileEditApi = {
  updateBasic: (payload: BasicProfilePayload): Promise<User> =>
    apiClient.put("/profiles/me/basic", payload).then((res) => UserSchema.parseAsync(res.data)),

  updateWork: (payload: WorkPayload): Promise<User> =>
    apiClient.put("/profiles/me/work", payload).then((res) => UserSchema.parseAsync(res.data)),

  updateCommunication: (payload: CommunicationPayload): Promise<User> =>
    apiClient.put("/profiles/me/communication", payload).then((res) => UserSchema.parseAsync(res.data)),

  getInterests: (): Promise<Interests> =>
    apiClient.get('/interests').then((res) => InterestsSchema.parseAsync(res.data)),

  updateInterests: (payload: InterestsPayload): Promise<User> =>
    apiClient.put("/profiles/me/interests", payload).then((res) => UserSchema.parseAsync(res.data)),

  uploadAvatar: (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/profiles/me/avatar", formData).then((res) => UserSchema.parseAsync(res.data));
  },
};

export default profileEditApi;