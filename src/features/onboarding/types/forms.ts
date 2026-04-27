import type { z } from 'zod'
import {
  basicInfoSchema,
  communicationSchema,
  completeSchema,
  interestsSchema,
  workSchema,
} from '@/src/features/onboarding/types/schemas'

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>
export type InterestsFormValues = z.infer<typeof interestsSchema>
export type WorkFormValues = z.infer<typeof workSchema>
export type CommunicationFormValues = z.infer<typeof communicationSchema>
export type AboutFormValues = z.infer<typeof completeSchema>
