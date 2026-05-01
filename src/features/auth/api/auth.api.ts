import type {
  LoginRequest,
  LoginResponse,
  ResendEmailOtpRequest,
  ResendEmailOtpResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse
} from "../types";
import { apiClient } from "@/src/lib/api/client";

export const authApi = {
  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    apiClient.post("/auth/register", data)
      .then((res) => res.data),

  verifyEmailOtp: (data: VerifyEmailOtpRequest): Promise<VerifyEmailOtpResponse> =>
    apiClient.post("/auth/email/verify", data)
      .then((res) => res.data),

  resendEmailOtp: (data: ResendEmailOtpRequest): Promise<ResendEmailOtpResponse> =>
    apiClient.post("/auth/email/resend", data)
      .then((res) => res.data),

  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post("/auth/login", data)
      .then((res) => res.data),

  refresh: (): Promise<{ accessToken: string }> =>
    apiClient.post("/auth/refresh")
      .then((res) => res.data),

  logout: (): Promise<void> =>
    apiClient.post("/auth/logout")
      .then(() => undefined),
}
