import { z } from "zod";

export const BasicInfoEditSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Дата рождения обязательна").refine((val) => {
    try {
      const parts = val.split('-').map(Number)
      if (parts.length < 3) return false
      const dob = new Date(parts[0], parts[1] - 1, parts[2])
      if (Number.isNaN(dob.getTime())) return false
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const m = today.getMonth() - dob.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
      return age >= 18
    } catch {
      return false
    }
  }, "Пользователь должен быть не младше 18 лет"),
  gender: z.enum(["MALE", "FEMALE"]),
  language: z.enum(["ru", "en"]),
  city: z.string().min(1, "Город обязателен"),
  about: z.string().optional(),
});

export const WorkEditSchema = z.object({
  jobTitle: z.string().optional(),
  department: z.string().optional(),
});

export const CommunicationEditSchema = z.object({
  goal: z.string().min(1, "Цель обязательна"),
  personalityType: z.string().min(1, "Тип личности обязателен"),
  timeSlots: z.array(z.string()).min(1, "Выберите хотя бы один временной слот"),
});

export const InterestsEditSchema = z.object({
  interests: z.array(z.string()).min(1, "Выберите хотя бы один интерес"),
});

export type BasicInfoEditFormValues = z.infer<typeof BasicInfoEditSchema>;
export type WorkEditFormValues = z.infer<typeof WorkEditSchema>;
export type CommunicationEditFormValues = z.infer<typeof CommunicationEditSchema>;
export type InterestsEditFormValues = z.infer<typeof InterestsEditSchema>;

export interface BasicProfileUpdatePayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  language: string;
  city: string;
  about?: string;
}

export interface WorkInfoUpdatePayload {
  jobTitle: string;
  department: string;
}

export interface CommunicationPreferencesUpdatePayload {
  goal: string;
  personalityType: string;
  timeSlots: string[];
}

export interface InterestsUpdatePayload {
  interests: string[];
}