import z from "zod";

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable(),
  dateOfBirth: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  language: z.string(),
  city: z.string().nullable(),
  about: z.string().nullable(),
  jobTitle: z.string().nullable(),
  department: z.string().nullable(),
  goal: z.string().nullable(),
  personalityType: z.string().nullable(),
  timeSlots: z.array(z.string()),
  avatarUrl: z.string().nullable(),
  interests: z.array(z.string()),
  hasFilledProfile: z.boolean(),
});
