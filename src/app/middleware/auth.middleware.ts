import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { RequestWithId } from './request-id.middleware';
import { createRequestLogger } from '../utils/logger.util';
import { ErrorHandler } from '../utils/error-handler.util';
import { UnauthorizedError, ServiceUnavailableError } from '../errors/custom-errors';
import { AuthService } from '../service/auth.service';

export const authenticateToken = async (
  req: AuthenticatedRequest & RequestWithId,
  res: Response,
  next: NextFunction
) => {
  const logger = createRequestLogger(req.requestId);

  try {
    const token = AuthService.extractToken(req);

    if (!token) {
      logger.warn('Authentication failed - missing token', { action: 'auth-middleware' });
      throw new UnauthorizedError('Access token required');
    }

    const authResult = await AuthService.validateToken(token);

    if (!authResult.success && authResult.error) {
      logger.warn('Authentication failed - token validation', {
        action: 'auth-middleware',
        errorCode: authResult.error.code,
        errorMessage: authResult.error.message
      });

      return res.status(authResult.error.status).json({
        message: authResult.error.message,
        error: authResult.error.code,
        requestId: req.requestId,
      });
    }

    if (!authResult.user) {
      logger.error('Authentication failed - no user in result', { action: 'auth-middleware' });
      throw new ServiceUnavailableError('Authentication service error');
    }

    req.user = authResult.user;

    logger.debug('Authentication successful', {
      action: 'auth-middleware',
      userId: authResult.user.userId
    });

    next();
  } catch (error: any) {
    logger.error('Authentication middleware error', {
      action: 'auth-middleware',
      errorType: error.constructor.name,
      errorMessage: error.message
    }, error);

    ErrorHandler.handleError(error, res, req.requestId, 'Authentication failed');
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest & RequestWithId,
  res: Response,
  next: NextFunction
) => {
  const logger = createRequestLogger(req.requestId);

  try {
    const token = AuthService.extractToken(req);

    if (!token) {
      logger.debug('Optional auth - no token provided', { action: 'optional-auth-middleware' });
      return next();
    }

    const authResult = await AuthService.validateToken(token);

    if (!authResult.success && authResult.error) {
      logger.warn('Optional auth - token validation failed', {
        action: 'optional-auth-middleware',
        errorCode: authResult.error.code,
        errorMessage: authResult.error.message
      });

      return res.status(authResult.error.status).json({
        message: authResult.error.message,
        error: authResult.error.code,
        requestId: req.requestId,
      });
    }

    if (authResult.user) {
      req.user = authResult.user;
      logger.debug('Optional auth - token validated successfully', {
        action: 'optional-auth-middleware',
        userId: authResult.user.userId
      });
    }

    next();
  } catch (error: any) {
    logger.error('Optional auth middleware error', {
      action: 'optional-auth-middleware',
      errorType: error.constructor.name,
      errorMessage: error.message
    }, error);

    ErrorHandler.handleError(error, res, req.requestId, 'Optional authentication failed');
  }
};
