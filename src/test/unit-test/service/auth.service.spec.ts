import { AuthService } from '../../../app/service/auth.service';
import { verify, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { ValidationError, ServiceUnavailableError } from '../../../app/errors/custom-errors';

// Mocks
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  TokenExpiredError: class TokenExpiredError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TokenExpiredError';
    }
  },
  JsonWebTokenError: class JsonWebTokenError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'JsonWebTokenError';
    }
  },
}));

describe('AuthService', () => {
  let mockVerify: jest.MockedFunction<typeof verify>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerify = verify as jest.MockedFunction<typeof verify>;
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('extractToken', () => {
    it('should extract token from Bearer authorization header', () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token-123',
        },
      };

      // Act
      const token = AuthService.extractToken(mockRequest);

      // Assert
      expect(token).toBe('valid-token-123');
    });

    it('should return null when no authorization header', () => {
      // Arrange
      const mockRequest = {
        headers: {},
      };

      // Act
      const token = AuthService.extractToken(mockRequest);

      // Assert
      expect(token).toBeNull();
    });

    it('should return null when authorization header has no Bearer token', () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Basic some-credential',
        },
      };

      // Act
      const token = AuthService.extractToken(mockRequest);

      // Assert
      expect(token).toBeNull();
    });

    it('should return null when authorization header is malformed', () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer',
        },
      };

      // Act
      const token = AuthService.extractToken(mockRequest);

      // Assert
      expect(token).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('should return success with valid token', async () => {
      // Arrange
      const validPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567999,
      };
      mockVerify.mockReturnValue(validPayload as any);

      // Act
      const result = await AuthService.validateToken('valid-token');

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
      });
      expect(result.error).toBeUndefined();
      expect(mockVerify).toHaveBeenCalledWith('valid-token', 'test-secret');
    });

    it('should throw ServiceUnavailableError when JWT_SECRET is missing', async () => {
      // Arrange
      delete process.env.JWT_SECRET;

      // Act & Assert
      await expect(AuthService.validateToken('any-token')).rejects.toThrow(ServiceUnavailableError);
    });

    it('should throw ValidationError when token payload is missing sub', async () => {
      // Arrange
      const invalidPayload = {
        email: 'test@example.com',
      };
      mockVerify.mockReturnValue(invalidPayload as any);

      // Act & Assert
      await expect(AuthService.validateToken('invalid-token')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when token payload is missing email', async () => {
      // Arrange
      const invalidPayload = {
        sub: 'user-123',
      };
      mockVerify.mockReturnValue(invalidPayload as any);

      // Act & Assert
      await expect(AuthService.validateToken('invalid-token')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when sub is not a string', async () => {
      // Arrange
      const invalidPayload = {
        sub: 123,
        email: 'test@example.com',
      };
      mockVerify.mockReturnValue(invalidPayload as any);

      // Act & Assert
      await expect(AuthService.validateToken('invalid-token')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when email is not a string', async () => {
      // Arrange
      const invalidPayload = {
        sub: 'user-123',
        email: null,
      };
      mockVerify.mockReturnValue(invalidPayload as any);

      // Act & Assert
      await expect(AuthService.validateToken('invalid-token')).rejects.toThrow(ValidationError);
    });

    it('should return error result for expired token', async () => {
      // Arrange
      const expiredError = new Error('Token expired');
      expiredError.name = 'TokenExpiredError';
      mockVerify.mockImplementation(() => {
        throw expiredError;
      });

      // Act
      const result = await AuthService.validateToken('expired-token');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED',
        status: 401,
      });
    });

    it('should return error result for malformed token', async () => {
      // Arrange
      const malformedError = new Error('Malformed token');
      malformedError.name = 'JsonWebTokenError';
      mockVerify.mockImplementation(() => {
        throw malformedError;
      });

      // Act
      const result = await AuthService.validateToken('malformed-token');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        message: 'Invalid token format',
        code: 'MALFORMED_TOKEN',
        status: 403,
      });
    });

    it('should return error result for unknown JWT error', async () => {
      // Arrange
      const unknownError = new Error('Unknown JWT error');
      unknownError.name = 'UnknownJWTError';
      mockVerify.mockImplementation(() => {
        throw unknownError;
      });

      // Act
      const result = await AuthService.validateToken('invalid-token');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        message: 'Token validation failed',
        code: 'INVALID_TOKEN',
        status: 403,
      });
    });
  });
});
