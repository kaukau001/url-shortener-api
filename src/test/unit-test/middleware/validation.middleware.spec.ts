import { Request, Response, NextFunction } from 'express';
import { validationMiddleware } from '../../../app/middleware/validation/validation.middleware';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Mocks
jest.mock('class-validator');
jest.mock('class-transformer');

// Test DTO class
class TestDto {
  name: string;
  email: string;
}

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockValidate: jest.MockedFunction<typeof validate>;
  let mockPlainToClass: jest.MockedFunction<typeof plainToClass>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    mockValidate = validate as jest.MockedFunction<typeof validate>;
    mockPlainToClass = plainToClass as jest.MockedFunction<typeof plainToClass>;
  });

  it('should call next() with valid data', async () => {
    // Arrange
    const testData = { name: 'Test', email: 'test@example.com' };
    const dtoInstance = new TestDto();

    mockRequest.body = testData;
    mockPlainToClass.mockReturnValue(dtoInstance);
    mockValidate.mockResolvedValue([]);

    const middleware = validationMiddleware(TestDto);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(mockPlainToClass).toHaveBeenCalledWith(TestDto, testData);
    expect(mockValidate).toHaveBeenCalledWith(dtoInstance);
    expect(mockRequest.body).toBe(dtoInstance);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 with validation errors', async () => {
    // Arrange
    const testData = { name: '', email: 'invalid-email' };
    const dtoInstance = new TestDto();

    const mockErrors = [
      {
        constraints: {
          isNotEmpty: 'Name should not be empty',
          minLength: 'Name must be at least 2 characters',
        },
      },
      {
        constraints: {
          isEmail: 'Email must be a valid email',
        },
      },
    ];

    mockRequest.body = testData;
    mockPlainToClass.mockReturnValue(dtoInstance);
    mockValidate.mockResolvedValue(mockErrors as any);

    const middleware = validationMiddleware(TestDto);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Dados inválidos',
      errors:
        'Name should not be empty, Name must be at least 2 characters; Email must be a valid email',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors without constraints', async () => {
    // Arrange
    const testData = { name: '', email: 'invalid-email' };
    const dtoInstance = new TestDto();

    const mockErrors = [
      {
        constraints: undefined,
      },
    ];

    mockRequest.body = testData;
    mockPlainToClass.mockReturnValue(dtoInstance);
    mockValidate.mockResolvedValue(mockErrors as any);

    const middleware = validationMiddleware(TestDto);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Dados inválidos',
      errors: '',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 500 on unexpected error', async () => {
    // Arrange
    const testData = { name: 'Test', email: 'test@example.com' };

    mockRequest.body = testData;
    mockPlainToClass.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const middleware = validationMiddleware(TestDto);

    // Act
    await middleware(mockRequest as Request, mockResponse as Response, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Erro interno do servidor',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
