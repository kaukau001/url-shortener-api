import { Request } from 'express';
import { verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ValidationError, ServiceUnavailableError } from '../errors/custom-errors';
import { TokenPayload, AuthResult } from '../types';

export class AuthService {
  private static getJwtSecret(): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ServiceUnavailableError('JWT configuration is missing');
    }
    return jwtSecret;
  }

  static extractToken(req: Pick<Request, 'headers'>): string | null {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1] || null;
  }

  private static validateTokenPayload(decoded: any): TokenPayload {
    if (!decoded?.sub || !decoded?.email) {
      throw new ValidationError('Invalid token payload: missing required fields');
    }

    if (typeof decoded.sub !== 'string' || typeof decoded.email !== 'string') {
      throw new ValidationError('Invalid token payload: invalid field types');
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  }

  static async validateToken(token: string): Promise<AuthResult> {
    try {
      const jwtSecret = this.getJwtSecret();
      const decoded = verify(token, jwtSecret) as any;
      const payload = this.validateTokenPayload(decoded);

      return {
        success: true,
        user: {
          userId: payload.sub,
          email: payload.email,
        },
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof ServiceUnavailableError) {
        throw error;
      }

      // Handle JWT specific errors
      if (error.name === 'TokenExpiredError') {
        return {
          success: false,
          error: {
            message: 'Token has expired',
            code: 'TOKEN_EXPIRED',
            status: 401,
          },
        };
      }

      if (error.name === 'JsonWebTokenError') {
        return {
          success: false,
          error: {
            message: 'Invalid token format',
            code: 'MALFORMED_TOKEN',
            status: 403,
          },
        };
      }

      // Unknown JWT error
      return {
        success: false,
        error: {
          message: 'Token validation failed',
          code: 'INVALID_TOKEN',
          status: 403,
        },
      };
    }
  }
}
