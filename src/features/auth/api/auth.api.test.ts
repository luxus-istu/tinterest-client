import { describe, expect, it, vi, beforeEach } from "vitest";
import { authApi } from "./auth.api";

vi.mock("@/src/lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

import { apiClient } from "@/src/lib/api/client";

const mockedPost = vi.mocked(apiClient.post);

describe("authApi", () => {
  beforeEach(() => {
    mockedPost.mockClear();
  });

  it("register calls correct endpoint", async () => {
    mockedPost.mockResolvedValueOnce({ data: { email: "test@test.com", message: "Код подтверждения отправлен на почту" } });
    const response = await authApi.register({
      firstName: "Ivan",
      lastName: "Ivanov",
      email: "test@test.com",
      password: "password123",
      gender: "MALE",
      dateOfBirth: "2000-01-01",
      language: "ru",
    });

    expect(mockedPost).toHaveBeenCalledWith("/v1/auth/register", expect.any(Object));
    expect(response.email).toBe("test@test.com");
    expect(response.message.length).toBeGreaterThan(0);
  });

  it("verifyEmailOtp calls correct endpoint", async () => {
    mockedPost.mockResolvedValueOnce({ data: { message: "Почта успешно подтверждена" } });
    const response = await authApi.verifyEmailOtp({
      email: "test@test.com",
      code: "123456",
    });

    expect(mockedPost).toHaveBeenCalledWith("/v1/auth/verify-email", expect.any(Object));
    expect(response.message).toContain("подтвержд");
  });

  it("verifyEmailOtp fails for invalid code", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Неверный код подтверждения"));
    await expect(
      authApi.verifyEmailOtp({
        email: "test@test.com",
        code: "000000",
      })
    ).rejects.toThrow("Неверный код подтверждения");
  });

  it("resendEmailOtp calls correct endpoint", async () => {
    mockedPost.mockResolvedValueOnce({ data: { message: "Новый код подтверждения отправлен" } });
    const response = await authApi.resendEmailOtp({
      email: "test@test.com",
    });

    expect(mockedPost).toHaveBeenCalledWith("/v1/auth/resend-otp", expect.any(Object));
    expect(response.message).toContain("отправлен");
  });

  it("login calls correct endpoint", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        user: { id: 1, firstName: "Demo", lastName: "User", email: "demo@tinterest.ru", gender: "MALE" },
        token: "mock-jwt-token",
      },
    });
    const response = await authApi.login({
      account: "demo@tinterest.ru",
      password: "password123",
    });

    expect(mockedPost).toHaveBeenCalledWith("/v1/auth/login", expect.any(Object));
    expect(response.token).toBe("mock-jwt-token");
  });

  it("login fails for invalid credentials", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Invalid credentials"));
    await expect(
      authApi.login({
        account: "wrong@tinterest.ru",
        password: "wrong",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("logout calls correct endpoint", async () => {
    mockedPost.mockResolvedValueOnce({ data: undefined });
    await authApi.logout();

    expect(mockedPost).toHaveBeenCalledWith("/v1/auth/logout");
  });
});
