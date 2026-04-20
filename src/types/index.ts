import z from "zod";

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
})

export const InterestSchema = z.object({
  interest_id: z.number(),
  name: z.string(),
  level: z.number(),
});

export const CommunicationPreferenceSchema = z.object({
  id: z.number(),
  goal: z.enum(["NEW_FRIENDS", "RELATIONSHIP", "NETWORKING"]),
  personality_type: z.enum(["INTROVERT", "EXTROVERT", "AMBIVERT"]),
  communication_format: z.array(
    z.enum(["ONLINE", "OFFLINE"])
  ),
});

export const WorkInfoSchema = z.object({
  id: z.number(),
  city: z.string(),
  job_title: z.string(),
  department: z.string(),
  work_format: z.enum(["OFFICE", "REMOTE", "HYBRID"]),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  middle_name: z.string(),
  date_of_birth: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  language: z.enum(["ru", "en"]),
  email: z.email(),
  about: z.string(),
  avatar_url: z.url(),
  has_filled_profile: z.boolean(),
  role: z.enum(["USER", "ADMIN", "MODERATOR"]),
  blocked: z.boolean(),
  email_verified: z.boolean(),
  work_info: WorkInfoSchema,
  communication_preference: CommunicationPreferenceSchema,
  interests: z.array(InterestSchema),
});


// Typescript types
export type User = z.infer<typeof UserSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type WorkInfo = z.infer<typeof WorkInfoSchema>;
export type CommunicationPreference = z.infer<typeof CommunicationPreferenceSchema>;
export type Interest = z.infer<typeof InterestSchema>;
