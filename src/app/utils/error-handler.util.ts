import { Response } from 'express';
import { CustomError, ErrorCode } from '../errors/custom-errors';

export class ErrorHandler {
  static handleError(
    error: any,
    res: Response,
    requestId: string,
    defaultMessage: string = 'An unexpected error occurred'
  ): void {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({
        message: error.message,
        error: error.code,
        requestId,
        ...(error.details && { details: error.details }),
      });
      return;
    }

    res.status(500).json({
      message: defaultMessage,
      error: ErrorCode.INTERNAL_ERROR,
      requestId,
    });
  }

  static handleUnauthorized(
    res: Response,
    requestId: string,
    message: string = 'User not authenticated'
  ): void {
    res.status(401).json({
      message,
      error: ErrorCode.UNAUTHORIZED,
      requestId,
    });
  }

  static handleNotFound(res: Response, requestId: string, resource: string = 'Resource'): void {
    res.status(404).json({
      message: `${resource} not found or has expired`,
      error: ErrorCode.URL_NOT_FOUND,
      requestId,
    });
  }

  static handleRedirectError(res: Response, requestId: string, code: string): void {
    try {
      res.redirect(302, `/error?message=temporarily-unavailable&code=${code}`);
    } catch (redirectError) {
      res.status(503).json({
        message: 'Redirection service temporarily unavailable',
        error: ErrorCode.SERVICE_UNAVAILABLE,
        code,
        requestId,
      });
    }
  }
}
