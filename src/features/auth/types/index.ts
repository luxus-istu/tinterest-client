import { UserSchema } from "@/src/types";
import z from "zod";

export const RegisterRequestSchema = z.object({
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  email: z.email(),
  password: z.string().min(8),
  gender: z.enum(["male", "female"]),
});

export const RegisterResponseSchema = z.object({
  email: z.email(),
  message: z.string(),
});

export const VerifyEmailOtpRequestSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const VerifyEmailOtpResponseSchema = z.object({
  message: z.string(),
});

export const ResendEmailOtpRequestSchema = z.object({
  email: z.email(),
});

export const ResendEmailOtpResponseSchema = z.object({
  message: z.string(),
});

export const LoginRequestSchema = z.object({
  account: z.string().min(3),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

// Typescript types
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type VerifyEmailOtpRequest = z.infer<typeof VerifyEmailOtpRequestSchema>;
export type VerifyEmailOtpResponse = z.infer<typeof VerifyEmailOtpResponseSchema>;
export type ResendEmailOtpRequest = z.infer<typeof ResendEmailOtpRequestSchema>;
export type ResendEmailOtpResponse = z.infer<typeof ResendEmailOtpResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
