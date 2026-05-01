import { ErrorResponseSchema, type ErrorResponse } from "@/src/types";

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
