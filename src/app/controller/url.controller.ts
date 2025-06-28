import { Router, Request, Response, NextFunction } from 'express';
import { UrlService } from '../service/url.service';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';
import { validateQuery } from '../middleware/validation/query-validation.middleware';
import { AuthenticatedRequest, UrlFilters } from '../types';
import { ListUrlsQueryDto, UpdateUrlCodeDto, DeleteUrlParamsDto } from '../dto/url';
import { RequestWithId } from '../middleware/request-id.middleware';
import { createRequestLogger } from '../utils/logger.util';
import { ErrorHandler } from '../utils/error-handler.util';
import {
  validationMiddleware,
  paramsValidationMiddleware,
} from '../middleware/validation/validation.middleware';

export const urlRouter = Router();
const urlService = new UrlService();

urlRouter.post(
  '/shorten',
  optionalAuth,
  async (req: AuthenticatedRequest & RequestWithId, res: Response) => {
    const logger = createRequestLogger(req.requestId);

    try {
      const userId = req.user?.userId || undefined;
      logger.info('Starting URL shortening process', {
        action: 'shorten-url',
        userId: userId || 'anonymous',
        hasOriginalUrl: !!req.body.originalUrl,
      });
      const result = await urlService.shorten(req.body.originalUrl, userId);
      logger.info('URL shortened successfully', {
        action: 'shorten-url',
        userId: userId || 'anonymous',
        shortCode: result.code,
      });
      res.status(201).json(result);
    } catch (error: any) {
      logger.error(
        'Failed to shorten URL',
        {
          action: 'shorten-url',
          userId: req.user?.userId || 'anonymous',
          errorType: error.constructor.name,
        },
        error
      );

      ErrorHandler.handleError(error, res, req.requestId, 'Failed to shorten URL');
    }
  }
);

urlRouter.get(
  '/user/urls',
  authenticateToken,
  validateQuery(ListUrlsQueryDto),
  async (req: AuthenticatedRequest & RequestWithId, res: Response) => {
    const logger = createRequestLogger(req.requestId);
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn('Unauthorized access attempt to user URLs', { action: 'list-user-urls' });
        return ErrorHandler.handleUnauthorized(res, req.requestId);
      }
      const filters = req.query as UrlFilters;
      logger.info('Fetching user URLs', {
        action: 'list-user-urls',
        userId,
        filters: JSON.stringify(filters),
      });

      const result = await urlService.listUserUrls(userId, filters);

      logger.info('User URLs fetched successfully', {
        action: 'list-user-urls',
        userId,
        urlCount: result.urls.length,
      });

      res.json(result);
    } catch (error: any) {
      logger.error(
        'Failed to fetch user URLs',
        {
          action: 'list-user-urls',
          userId: req.user?.userId,
          errorType: error.constructor.name,
        },
        error
      );

      ErrorHandler.handleError(error, res, req.requestId, 'Failed to fetch user URLs');
    }
  }
);

urlRouter.patch(
  '/user/urls',
  validationMiddleware(UpdateUrlCodeDto),
  authenticateToken,
  async (req: AuthenticatedRequest & RequestWithId, res: Response) => {
    const logger = createRequestLogger(req.requestId);
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn('Unauthorized access attempt to update URL code', {
          action: 'update-user-url-code',
        });
        return ErrorHandler.handleUnauthorized(res, req.requestId);
      }

      const { originalCode, newCode } = req.body;
      logger.info('Updating user URL code', {
        action: 'update-user-url-code',
        userId,
        originalCode,
        newCode,
      });
      const result = await urlService.updateUserUrlCode(originalCode, newCode, userId);
      logger.info('User URL code updated successfully', {
        action: 'update-user-url-code',
        userId,
        originalCode,
        newCode,
      });
      res.json(result);
    } catch (error: any) {
      logger.error(
        'Failed to update user URL code',
        {
          action: 'update-user-url-code',
          userId: req.user?.userId,
          errorType: error.constructor.name,
        },
        error
      );

      ErrorHandler.handleError(error, res, req.requestId, 'Failed to update URL code');
    }
  }
);

urlRouter.delete(
  '/user/urls/:code',
  authenticateToken,
  paramsValidationMiddleware(DeleteUrlParamsDto),
  async (req: AuthenticatedRequest & RequestWithId, res: Response) => {
    const logger = createRequestLogger(req.requestId);
    try {
      const userId = req.user?.userId;
      if (!userId) {
        logger.warn('Unauthorized access attempt to delete URL', {
          action: 'delete-user-url',
          code: req.params.code,
        });
        return ErrorHandler.handleUnauthorized(res, req.requestId);
      }
      logger.info('Deleting user URL', {
        action: 'delete-user-url',
        userId,
        code: req.params.code,
      });
      const result = await urlService.deleteUserUrlByCode(req.params.code, userId);
      logger.info('User URL deleted successfully', {
        action: 'delete-user-url',
        userId,
        code: req.params.code,
      });
      res.json(result);
    } catch (error: any) {
      logger.error(
        'Failed to delete user URL',
        {
          action: 'delete-user-url',
          userId: req.user?.userId,
          code: req.params.code,
          errorType: error.constructor.name,
        },
        error
      );
      ErrorHandler.handleError(error, res, req.requestId, 'Failed to delete URL');
    }
  }
);

urlRouter.get('/:code', async (req: Request & RequestWithId, res: Response, next) => {
  const code = req.params.code;
  const logger = createRequestLogger(req.requestId);

  try {
    logger.info('Redirecting short URL', {
      action: 'redirect-url',
      code,
      userAgent: req.get('User-Agent')?.substring(0, 100),
    });
    const originalUrl = await urlService.redirectToOriginalUrl(code);
    if (!originalUrl) {
      logger.warn('Short URL not found', { action: 'redirect-url', code });
      return ErrorHandler.handleNotFound(res, req.requestId, 'Short URL');
    }
    logger.info('Redirecting to original URL', {
      action: 'redirect-url',
      code,
    });
    res.redirect(301, originalUrl);
  } catch (error: any) {
    logger.error(
      'Failed to redirect short URL',
      {
        action: 'redirect-url',
        code: req.params.code,
        errorType: error.constructor.name,
      },
      error
    );
    ErrorHandler.handleRedirectError(res, req.requestId, req.params.code);
  }
});
