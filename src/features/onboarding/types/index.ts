import z from "zod"
import { BasicInfoSchema, InterestsInfoSchema, WorkInfoSchema, CommunicationInfoSchema, CompleteInfoSchema, InterestsSchema, InterestSchema } from "./schemas"
export type * from "./forms"

export type BasicInfoFormValues = z.infer<typeof BasicInfoSchema>
export type InterestsFormValues = z.infer<typeof InterestsInfoSchema>
export type WorkFormValues = z.infer<typeof WorkInfoSchema>
export type CommunicationFormValues = z.infer<typeof CommunicationInfoSchema>
export type AboutFormValues = z.infer<typeof CompleteInfoSchema>
export type Interest = z.infer<typeof InterestSchema>
export type Interests = z.infer<typeof InterestsSchema>;

export interface BasicProfilePayload {
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: string
  language: string
  city: string
  about?: string
}

export interface InterestsPayload {
  interests: string[]
}

export interface WorkPayload {
  jobTitle: string
  department: string
}

export interface CommunicationPayload {
  goal: string
  personalityType: string
  timeSlots: string[]
}

export interface CompleteProfilePayload {
  city: string
  about: string
  jobTitle: string
  department: string
  goal: string
  personalityType: string
  timeSlots: string[]
  interests: string[]
}
