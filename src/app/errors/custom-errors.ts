export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_URL = 'INVALID_URL',
  INVALID_CODE = 'INVALID_CODE',
  INVALID_USER_ID = 'INVALID_USER_ID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  URL_NOT_FOUND = 'URL_NOT_FOUND',
  CODE_ALREADY_EXISTS = 'CODE_ALREADY_EXISTS',
  DATABASE_TIMEOUT = 'DATABASE_TIMEOUT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CODE_GENERATION_FAILED = 'CODE_GENERATION_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class CustomError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.INVALID_INPUT, 400, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, ErrorCode.URL_NOT_FOUND, 404, details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized access', details?: any) {
    super(message, ErrorCode.UNAUTHORIZED, 401, details);
  }
}

export class AccessDeniedError extends CustomError {
  constructor(message: string = 'Access denied', details?: any) {
    super(message, ErrorCode.ACCESS_DENIED, 403, details);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, ErrorCode.CODE_ALREADY_EXISTS, 409, details);
  }
}

export class TimeoutError extends CustomError {
  constructor(operation: string, timeout: number) {
    super(`${operation} timed out after ${timeout}ms`, ErrorCode.DATABASE_TIMEOUT, 503);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(message, ErrorCode.SERVICE_UNAVAILABLE, 503, details);
  }
}

export class CodeGenerationError extends CustomError {
  constructor(message: string = 'Failed to generate unique code') {
    super(message, ErrorCode.CODE_GENERATION_FAILED, 500);
  }
}
