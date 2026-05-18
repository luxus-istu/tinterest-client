import z from 'zod'
import {
  goals,
  personalityTypes,
} from '@/src/features/onboarding/constants'

export const BasicInfoSchema = z.object({
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().min(1, 'Введите фамилию'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Введите дату рождения'),
  gender: z.enum(['MALE', 'FEMALE']),
  language: z.enum(['ru', 'en']),
  city: z.string().min(1, 'Введите город'),
  about: z.string().optional(),
})

export const InterestSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const InterestsSchema = z.array(InterestSchema);

export const InterestsInfoSchema = z.object({
  interests: z.array(z.string()).min(1, 'Выберите хотя бы один интерес'),
})

export const WorkInfoSchema = z.object({
  jobTitle: z.string().min(1, 'Введите должность'),
  department: z.string().min(1, 'Введите отдел'),
})

export const CommunicationInfoSchema = z.object({
  goal: z.enum(goals),
  personalityType: z.enum(personalityTypes),
  timeSlots: z.array(z.string()).min(1, 'Выберите хотя бы один временной слот'),
})

export const CompleteInfoSchema = z.object({
  about: z.string().optional(),
})
