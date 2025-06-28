import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithId extends Request {
    requestId: string;
}

export const requestIdMiddleware = (req: RequestWithId, res: Response, next: NextFunction) => {
    const existingRequestId = req.headers['x-request-id'] as string;
    req.requestId = existingRequestId || uuidv4();
    res.setHeader('X-Request-ID', req.requestId);
    next();
};
