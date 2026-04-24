import { describe, expect, it } from "vitest";
import { authApi } from "./auth.api";

describe("authApi email verification", () => {
  it("register returns email and message", async () => {
    const response = await authApi.register({
      firstName: "Ivan",
      lastName: "Ivanov",
      email: "test@test.com",
      password: "password123",
      gender: "male",
    });

    expect(response.email).toBe("test@test.com");
    expect(response.message.length).toBeGreaterThan(0);
  });

  it("verifyEmailOtp succeeds for valid demo code", async () => {
    const response = await authApi.verifyEmailOtp({
      email: "test@test.com",
      otp: "123456",
    });

    expect(response.message).toContain("подтвержд");
  });

  it("verifyEmailOtp fails for invalid code", async () => {
    await expect(
      authApi.verifyEmailOtp({
        email: "test@test.com",
        otp: "000000",
      })
    ).rejects.toThrow("Неверный код подтверждения");
  });

  it("resendEmailOtp returns success message", async () => {
    const response = await authApi.resendEmailOtp({
      email: "test@test.com",
    });

    expect(response.message).toContain("отправлен");
  });
});
