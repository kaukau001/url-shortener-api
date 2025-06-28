import { Request } from 'express';
import { AuthenticatedUser } from './authenticated-user.types';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
