import { Request, Response, NextFunction } from 'express';
import { validateQuery } from '../../../app/middleware/validation/query-validation.middleware';
import { ListUrlsQueryDto } from '../../../app/dto/url';

describe('QueryValidationMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('validateQuery', () => {
    it('should pass valid query parameters', async () => {
      // Arrange
      mockRequest.query = {
        page: '1',
        limit: '10',
        status: 'ACTIVE',
        code: 'test123',
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.query).toEqual({
        page: 1,
        limit: 10,
        status: 'ACTIVE',
        code: 'test123',
      });
    });

    it('should reject invalid page parameter', async () => {
      // Arrange
      mockRequest.query = {
        page: '0',
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining(['Page deve ser maior que 0']),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid limit parameter', async () => {
      // Arrange
      mockRequest.query = {
        limit: '150', // Invalid: limit must be <= 100
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining(['Limit deve ser menor ou igual a 100']),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid status parameter', async () => {
      // Arrange
      mockRequest.query = {
        status: 'INVALID_STATUS', // Invalid enum value
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining(['Status deve ser ACTIVE ou DELETED']),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid UUID for id parameter', async () => {
      // Arrange
      mockRequest.query = {
        id: 'not-a-uuid', // Invalid UUID
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining(['ID deve ser um UUID válido']),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid date format', async () => {
      // Arrange
      mockRequest.query = {
        startDate: '2023-13-01', // Invalid date (month 13)
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining([
          expect.stringContaining('StartDate deve estar no formato ISO 8601'),
        ]),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should remove undefined and empty values', async () => {
      // Arrange
      mockRequest.query = {
        page: '1',
        code: 'test123',
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.query).toEqual({
        page: 1,
        code: 'test123',
      });
    });

    it('should handle multiple validation errors', async () => {
      // Arrange
      mockRequest.query = {
        page: '0', // Invalid page
        limit: '150', // Invalid limit
        status: 'INVALID', // Invalid status
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining([
          'Page deve ser maior que 0',
          'Limit deve ser menor ou igual a 100',
          'Status deve ser ACTIVE ou DELETED',
        ]),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should pass when no query parameters are provided', async () => {
      // Arrange
      mockRequest.query = {};

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.query).toEqual({});
    });

    it('should handle exceptions gracefully', async () => {
      // Arrange
      mockRequest.query = {
        page: 'not-a-number',
      };

      const middleware = validateQuery(ListUrlsQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Parâmetros de consulta inválidos',
        errors: expect.arrayContaining(['Page deve ser um número inteiro válido']),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
