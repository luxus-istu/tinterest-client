import z from "zod";
import { ErrorResponseSchema, UserSchema } from "./schemes";

export type User = z.infer<typeof UserSchema>;
export type ProfileResponse = User;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
<<<<<<< HEAD
export type WorkInfo = z.infer<typeof WorkInfoSchema>;
export type CommunicationPreference = z.infer<typeof CommunicationPreferenceSchema>;
export type Interest = z.infer<typeof InterestSchema>;
=======
>>>>>>> origin/main
