import { Router, Request, Response } from 'express';
import { RequestWithId } from '../middleware/request-id.middleware';
import { createRequestLogger } from '../utils/logger.util';

export const healthCheckRouter = Router();

healthCheckRouter.get('/health', (req: Request & RequestWithId, res: Response) => {
  const logger = createRequestLogger(req.requestId);
  logger.debug('Health check endpoint accessed', { action: 'health-check' });
  res.json({ status: 'ok', timestamp: new Date().toISOString(), requestId: req.requestId });
});
