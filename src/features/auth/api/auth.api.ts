import { apiClient } from "@/src/lib/api/client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RegisterResponseSchema
} from "../types";

const ENDPONTS = {
  REGISTER: "/auth/register",

  EMAIL_VERIFY: "/auth/email/verify",
  EMAIL_RESEND: "/auth/email/resend",

  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",

  REFRESH: "/auth/refresh"
} as const;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  // TODO: implement when backend is ready
  // register: (data: RegisterRequest): Promise<RegisterResponse> => apiClient.post(ENDPONTS.REGISTER, data)
  //   .then((res) => RegisterResponseSchema.parse(res.data))
  //   .catch((err) => Promise.reject(err)),
  // login: (data: LoginRequest): Promise<LoginResponse> => apiClient.post(ENDPONTS.LOGIN, data)
  //   .then((res) => res.data)
  //   .catch((err) => Promise.reject(err)),
  // logout: (): Promise<void> => apiClient.post(ENDPONTS.LOGOUT)
  //   .then(() => undefined)
  //   .catch((err) => Promise.reject(err)),
  // refresh: (): Promise<boolean> => apiClient.post(ENDPONTS.REFRESH)
  //   .then((res) => res.status === 204)
  //   .catch((err) => Promise.reject(err)),

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    await delay(1000);
    if (data.email.trim().length > 0) {
      return { email: data.email, message: "Код подтверждения отправлен на почту" };
    }
    throw new Error("Invalid email");
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    await delay(1000);
    if (data.account === "demo@tinterest.ru" && data.password === "password123") {
      return {
        user: {
          id: 1,
          firstName: "Demo",
          lastName: "User",
          email: "demo@tinterest.ru",
          gender: "MALE",
          // ... other fields would be here
        },
        token: "mock-jwt-token"
      } as unknown as LoginResponse;
    }
    throw new Error("Invalid credentials");
  },

  logout: async (): Promise<void> => {
    await delay(500);
  }
}
