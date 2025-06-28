import { Request, Response } from 'express';
import { requestIdMiddleware, RequestWithId } from '../../../app/middleware/request-id.middleware';

// Mock do uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-uuid-123'),
}));

import { v4 as uuidv4 } from 'uuid';

describe('RequestId Middleware', () => {
  let mockRequest: Partial<RequestWithId>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should generate a new UUID when no x-request-id header is present', () => {
    // Act
    requestIdMiddleware(mockRequest as RequestWithId, mockResponse as Response, mockNext);

    // Assert
    expect(mockRequest.requestId).toBe('generated-uuid-123');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-ID', 'generated-uuid-123');
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(uuidv4).toHaveBeenCalledTimes(1);
  });

  it('should use existing x-request-id header when present', () => {
    // Arrange
    const existingRequestId = 'existing-request-id-456';
    mockRequest.headers = {
      'x-request-id': existingRequestId,
    };

    // Act
    requestIdMiddleware(mockRequest as RequestWithId, mockResponse as Response, mockNext);

    // Assert
    expect(mockRequest.requestId).toBe(existingRequestId);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-ID', existingRequestId);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(uuidv4).not.toHaveBeenCalled();
  });

  it('should handle empty x-request-id header by generating new UUID', () => {
    // Arrange
    mockRequest.headers = {
      'x-request-id': '',
    };

    // Act
    requestIdMiddleware(mockRequest as RequestWithId, mockResponse as Response, mockNext);

    // Assert
    expect(mockRequest.requestId).toBe('generated-uuid-123');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-ID', 'generated-uuid-123');
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(uuidv4).toHaveBeenCalledTimes(1);
  });
});
