import { z } from 'zod'
import {
  communicationFormats,
  goals,
  personalityTypes,
  workFormats,
} from '@/src/features/onboarding/constants'

export const basicInfoSchema = z.object({
  first_name: z.string().min(1, 'Введите имя'),
  last_name: z.string().min(1, 'Введите фамилию'),
  birth_date: z
    .string()
    .min(1, 'Введите дату рождения')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Используйте формат даты YYYY-MM-DD'),
})

export const interestsSchema = z.object({
  interest_ids: z.array(z.number()).min(1, 'Выберите хотя бы один интерес'),
})

export const workSchema = z.object({
  city: z.string().min(1, 'Введите город'),
  job_title: z.string().min(1, 'Введите должность'),
  department: z.string().min(1, 'Введите отдел'),
  work_format: z.enum(workFormats),
})

export const communicationSchema = z.object({
  goal: z.enum(goals),
  communication_format: z
    .array(z.enum(communicationFormats))
    .min(1, 'Выберите хотя бы один формат общения'),
})

export const completeSchema = z.object({
  about: z.union([
    z.literal(''),
    z.string().min(10, 'Расскажите о себе подробнее (минимум 10 символов)'),
  ]),
  personality_type: z.enum(personalityTypes),
})
