import { Logger, LogLevel, LogContext } from '../../../app/utils/logger.util';

// Mock do uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-uuid-456'),
}));

// Mock do console
const consoleSpy = {
  error: jest.spyOn(console, 'error').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  log: jest.spyOn(console, 'log').mockImplementation(),
  debug: jest.spyOn(console, 'debug').mockImplementation(),
};

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
    delete process.env.LOG_LEVEL;
  });

  afterAll(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe('error', () => {
    it('should log error with generated UUID when no requestId provided', () => {
      // Act
      Logger.error('Test error message');

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[generated-uuid-456] [ERROR] Test error message')
      );
    });

    it('should log error with provided requestId', () => {
      // Arrange
      const context: LogContext = { requestId: 'custom-request-id' };

      // Act
      Logger.error('Test error message', context);

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[custom-request-id] [ERROR] Test error message')
      );
    });

    it('should include error details when error object is provided', () => {
      // Arrange
      const error = new Error('Test error');
      const context: LogContext = { requestId: 'test-id' };

      // Act
      Logger.error('Error occurred', context, error);

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[test-id] [ERROR] Error occurred'),
        {
          stack: error.stack,
          name: error.name,
          message: error.message,
        }
      );
    });

    it('should include additional context data', () => {
      // Arrange
      const context: LogContext = {
        requestId: 'test-id',
        userId: 'user-123',
        action: 'test-action',
      };

      // Act
      Logger.error('Test message', context);

      // Assert
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('{"userId":"user-123","action":"test-action"}')
      );
    });
  });

  describe('warn', () => {
    it('should log warning with generated UUID when no requestId provided', () => {
      // Act
      Logger.warn('Test warning');

      // Assert
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[generated-uuid-456] [WARN] Test warning')
      );
    });
  });

  describe('info', () => {
    it('should log info with generated UUID when no requestId provided', () => {
      // Act
      Logger.info('Test info');

      // Assert
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[generated-uuid-456] [INFO] Test info')
      );
    });
  });

  describe('debug', () => {
    it('should log debug in development environment', () => {
      // Arrange
      process.env.NODE_ENV = 'dev';

      // Act
      Logger.debug('Test debug');

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[generated-uuid-456] [DEBUG] Test debug')
      );
    });

    it('should log debug when LOG_LEVEL is debug', () => {
      // Arrange
      process.env.LOG_LEVEL = 'debug';

      // Act
      Logger.debug('Test debug');

      // Assert
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[generated-uuid-456] [DEBUG] Test debug')
      );
    });

    it('should not log debug in production environment', () => {
      // Arrange
      process.env.NODE_ENV = 'production';

      // Act
      Logger.debug('Test debug');

      // Assert
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });
  });
});
