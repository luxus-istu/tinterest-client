import { z } from "zod"

export const InterestDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const UserCardDtoSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable(),
  gender: z.enum(["MALE", "FEMALE"]),
  city: z.string().nullable(),
  about: z.string().nullable(),
  jobTitle: z.string().nullable(),
  department: z.string().nullable(),
  goal: z.string().nullable(),
  personalityType: z.string().nullable(),
  timeSlots: z.array(z.string()).nullable(),
  avatarUrl: z.string().nullable(),
  interests: z.array(InterestDtoSchema),
  workFormat: z.string().optional(),
  communicationFormat: z.array(z.string()).optional(),
})

export const RecommendationResponseSchema = z.object({
  users: z.array(UserCardDtoSchema),
  hasMore: z.boolean(),
  cycle: z.number(),
})

export const SwipeRequestSchema = z.object({
  toUserId: z.number(),
  reaction: z.enum(["LIKE", "DISLIKE"]),
})

export const SwipeResponseSchema = z.object({
  result: z.string(),
  matchId: z.number().nullable().optional(),
  chatId: z.number().nullable().optional(),
})

export const RecommendationFiltersDtoSchema = z.object({
  city: z.string().optional(),
  goal: z.string().optional(),
  department: z.string().optional(),
  gender: z.string().optional(),
  personalityType: z.string().optional(),
  interestIds: z.array(z.number()).optional(),
  empty: z.boolean().optional(),
})

export const FilteredRecommendationResponseSchema = z.object({
  users: z.array(UserCardDtoSchema),
  hasMore: z.boolean(),
  empty: z.boolean(),
})

export const InterestsArraySchema = z.array(InterestDtoSchema)

export type InterestDto = z.infer<typeof InterestDtoSchema>
export type UserCardDto = z.infer<typeof UserCardDtoSchema>
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>
export type SwipeRequest = z.infer<typeof SwipeRequestSchema>
export type SwipeResponse = z.infer<typeof SwipeResponseSchema>
export type RecommendationFiltersDto = z.infer<typeof RecommendationFiltersDtoSchema>
export type FilteredRecommendationResponse = z.infer<typeof FilteredRecommendationResponseSchema>
