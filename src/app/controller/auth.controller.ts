import { Router, Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { validationMiddleware } from '../middleware/validation/validation.middleware';
import { RequestWithId } from '../middleware/request-id.middleware';
import { createRequestLogger } from '../utils/logger.util';

export const authRouter = Router();
const userService = new UserService();

authRouter.post(
  '/register',
  validationMiddleware(RegisterDto),
  async (req: Request & RequestWithId, res: Response) => {
    const logger = createRequestLogger(req.requestId);

    try {
      logger.info('User registration attempt', {
        action: 'user-register',
        email: req.body.email,
      });

      const result = await userService.register(req.body);

      logger.info('User registered successfully', {
        action: 'user-register',
        email: req.body.email,
      });

      res.status(201).json(result);
    } catch (error: any) {
      logger.error(
        'User registration failed',
        {
          action: 'user-register',
          email: req.body.email,
          errorMessage: error.message,
        },
        error
      );

      res.status(400).json({
        message: error.message,
        requestId: req.requestId,
      });
    }
  }
);

authRouter.post(
  '/login',
  validationMiddleware(LoginDto),
  async (req: Request & RequestWithId, res: Response) => {
    const logger = createRequestLogger(req.requestId);
    try {
      logger.info('User login attempt', {
        action: 'user-login',
        email: req.body.email,
      });
      const token = await userService.login(req.body);
      if (!token) {
        logger.warn('Login failed - invalid credentials', {
          action: 'user-login',
          email: req.body.email,
        });
        return res.status(401).json({
          message: 'Invalid credentials',
          requestId: req.requestId,
        });
      }
      logger.info('User logged in successfully', {
        action: 'user-login',
        email: req.body.email,
      });
      res.json(token);
    } catch (error: any) {
      logger.error(
        'Login process failed',
        {
          action: 'user-login',
          email: req.body.email,
          errorMessage: error.message,
        },
        error
      );
      res.status(400).json({
        message: error.message,
        requestId: req.requestId,
      });
    }
  }
);
