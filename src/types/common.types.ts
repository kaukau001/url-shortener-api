export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
  details?: any;
}

export interface SuccessResponse<T = any> {
  data: T;
  message?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface RequestId {
  requestId: string;
}
