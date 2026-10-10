export interface ApiErrorShape {
  status: number;
  message: string;
  code?: string;
}

export class ApiError extends Error implements ApiErrorShape {
  readonly status: number;
  readonly code?: string;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = 'ApiError';
    this.status = shape.status;
    this.code = shape.code;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof Error) {
    return new ApiError({ status: 0, message: error.message });
  }
  return new ApiError({ status: 0, message: 'An unexpected error occurred' });
}
