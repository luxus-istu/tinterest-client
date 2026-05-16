import type { ErrorResponse } from "@/src/types";
import { ErrorResponseSchema } from "@/src/types/schemes";

export class ApiError extends Error implements ErrorResponse {
  code: string;

  constructor(response: ErrorResponse) {
    super(response.message);
    this.code = response.code;
    this.name = "ApiError";
  }
}

export function parseErrorResponse(data: unknown): ApiError {
  const parsed = ErrorResponseSchema.parse(data);
  return new ApiError(parsed);
}
