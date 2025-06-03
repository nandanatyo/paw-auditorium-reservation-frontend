export interface ErrorResponse {
  message: string | null;
  detail?: any;
  error_code: string | null;
  trace_id?: string | null;
}

export class ApiError extends Error {
  status?: number;
  data?: ErrorResponse;

  constructor(message: string, status?: number, data?: ErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}
