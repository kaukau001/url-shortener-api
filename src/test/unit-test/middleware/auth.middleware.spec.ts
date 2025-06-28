import { Response, NextFunction } from 'express';
import { authenticateToken, optionalAuth } from '../../../app/middleware/auth.middleware';
import { AuthService } from '../../../app/service/auth.service';
import { AuthenticatedRequest } from '../../../app/types';
import { RequestWithId } from '../../../app/middleware/request-id.middleware';
import { UnauthorizedError, ServiceUnavailableError } from '../../../app/errors/custom-errors';

// Mocks
jest.mock('../../../app/service/auth.service');
jest.mock('../../../app/utils/logger.util', () => ({
  createRequestLogger: jest.fn(() => ({
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  })),
}));
jest.mock('../../../app/utils/error-handler.util', () => ({
  ErrorHandler: {
    handleError: jest.fn(),
  },
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthenticatedRequest & RequestWithId>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockAuthService: jest.Mocked<typeof AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      headers: {},
      requestId: 'test-request-id-123',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
  });

  describe('authenticateToken', () => {
    it('should call next() with valid token', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('valid-token');
      mockAuthService.validateToken.mockResolvedValue({
        success: true,
        user: {
          userId: 'user-123',
          email: 'test@example.com',
        },
      });

      // Act
      await authenticateToken(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
      });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle UnauthorizedError when no token provided', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue(null);

      // Act
      await authenticateToken(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockAuthService.validateToken).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
      // ErrorHandler.handleError should be called for UnauthorizedError
    });

    it('should return error response when token validation fails', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('invalid-token');
      mockAuthService.validateToken.mockResolvedValue({
        success: false,
        error: {
          message: 'Token has expired',
          code: 'TOKEN_EXPIRED',
          status: 401,
        },
      });

      // Act
      await authenticateToken(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('invalid-token');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token has expired',
        error: 'TOKEN_EXPIRED',
        requestId: 'test-request-id-123',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle ServiceUnavailableError when auth result has no user', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('valid-token');
      mockAuthService.validateToken.mockResolvedValue({
        success: true,
        // No user property
      });

      // Act
      await authenticateToken(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('valid-token');
      expect(mockNext).not.toHaveBeenCalled();
      // ErrorHandler.handleError should be called for ServiceUnavailableError
    });

    it('should handle errors thrown by AuthService', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('valid-token');
      mockAuthService.validateToken.mockRejectedValue(
        new ServiceUnavailableError('JWT configuration is missing')
      );

      // Act
      await authenticateToken(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('valid-token');
      expect(mockNext).not.toHaveBeenCalled();
      // ErrorHandler.handleError should be called
    });
  });

  describe('optionalAuth', () => {
    it('should call next() without token', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue(null);

      // Act
      await optionalAuth(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockAuthService.validateToken).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should set user in request with valid token', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('valid-token');
      mockAuthService.validateToken.mockResolvedValue({
        success: true,
        user: {
          userId: 'user-456',
          email: 'optional@example.com',
        },
      });

      // Act
      await optionalAuth(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.extractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual({
        userId: 'user-456',
        email: 'optional@example.com',
      });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return error response when token validation fails', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('expired-token');
      mockAuthService.validateToken.mockResolvedValue({
        success: false,
        error: {
          message: 'Invalid token format',
          code: 'MALFORMED_TOKEN',
          status: 403,
        },
      });

      // Act
      await optionalAuth(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('expired-token');
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token format',
        error: 'MALFORMED_TOKEN',
        requestId: 'test-request-id-123',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next() when token validation succeeds but no user returned', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('valid-token');
      mockAuthService.validateToken.mockResolvedValue({
        success: true,
        // No user property
      });

      // Act
      await optionalAuth(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle errors thrown by AuthService', async () => {
      // Arrange
      mockAuthService.extractToken.mockReturnValue('valid-token');
      mockAuthService.validateToken.mockRejectedValue(
        new ServiceUnavailableError('JWT configuration is missing')
      );

      // Act
      await optionalAuth(
        mockRequest as AuthenticatedRequest & RequestWithId,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockAuthService.validateToken).toHaveBeenCalledWith('valid-token');
      expect(mockNext).not.toHaveBeenCalled();
      // ErrorHandler.handleError should be called
    });
  });
});
