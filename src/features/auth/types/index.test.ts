import { describe, expect, it } from "vitest";
import {
  ResendEmailOtpRequestSchema,
  VerifyEmailOtpRequestSchema,
} from "./index";

describe("auth otp schemas", () => {
  it("accepts valid otp payload", () => {
    const parsed = VerifyEmailOtpRequestSchema.parse({
      email: "test@test.com",
      otp: "123456",
    });

    expect(parsed.otp).toBe("123456");
  });

  it("rejects otp payload with wrong length", () => {
    expect(() =>
      VerifyEmailOtpRequestSchema.parse({
        email: "test@test.com",
        otp: "12345",
      })
    ).toThrow();
  });

  it("accepts resend payload with email", () => {
    const parsed = ResendEmailOtpRequestSchema.parse({
      email: "test@test.com",
    });

    expect(parsed.email).toBe("test@test.com");
  });
});
