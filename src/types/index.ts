import z from "zod";
import { ErrorResponseSchema, UserSchema } from "./schemes";

export type User = z.infer<typeof UserSchema>;
export type ProfileResponse = User;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
