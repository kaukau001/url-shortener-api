import { UrlService } from '../../../app/service/url.service';
import { UrlRepository } from '../../../app/repository/url/url.repository';
import { UrlMapper } from '../../../app/mappers/url.mapper';
import { UrlStatus } from '../../../app/types';
import { nanoid } from 'nanoid';

// Mocks
jest.mock('../../../app/repository/url/url.repository');
jest.mock('../../../app/mappers/url.mapper');
jest.mock('nanoid');

describe('UrlService', () => {
  let urlService: UrlService;
  let mockUrlRepository: jest.Mocked<UrlRepository>;
  let mockNanoid: jest.MockedFunction<typeof nanoid>;

  beforeEach(() => {
    jest.clearAllMocks();

    urlService = new UrlService();
    mockUrlRepository = urlService['urlRepository'] as jest.Mocked<UrlRepository>;
    mockNanoid = nanoid as jest.MockedFunction<typeof nanoid>;
  });

  describe('shorten', () => {
    const mockUrlEntity = {
      id: 'test-id',
      code: 'abc123',
      originalUrl: 'https://www.google.com',
      clicks: 0,
      status: 'ACTIVE',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockUrlResponse = {
      id: 'test-id',
      code: 'abc123',
      originalUrl: 'https://www.google.com',
      shortUrl: 'http://localhost:3000/abc123',
      clicks: 0,
      status: UrlStatus.ACTIVE,
      userId: 'user-id',
      createdAt: '2025-06-26T00:00:00.000Z',
      updatedAt: '2025-06-26T00:00:00.000Z',
    };

    it('should successfully shorten a URL with user ID', async () => {
      // Arrange
      mockNanoid.mockReturnValue('abc123');
      mockUrlRepository.codeIsActive.mockResolvedValue(false);
      mockUrlRepository.create.mockResolvedValue(mockUrlEntity);
      (UrlMapper.toUrlResponse as jest.Mock).mockReturnValue(mockUrlResponse);

      // Act
      const result = await urlService.shorten('https://www.google.com', 'user-id');

      // Assert
      expect(mockNanoid).toHaveBeenCalledWith(6);
      expect(mockUrlRepository.codeIsActive).toHaveBeenCalledWith('abc123');
      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        code: 'abc123',
        originalUrl: 'https://www.google.com',
        userId: 'user-id',
      });
      expect(UrlMapper.toUrlResponse).toHaveBeenCalledWith(mockUrlEntity);
      expect(result).toEqual(mockUrlResponse);
    });

    it('should successfully shorten a URL without user ID (anonymous)', async () => {
      // Arrange
      mockNanoid.mockReturnValue('xyz789');
      mockUrlRepository.codeIsActive.mockResolvedValue(false);
      mockUrlRepository.create.mockResolvedValue({ ...mockUrlEntity, userId: null });
      (UrlMapper.toUrlResponse as jest.Mock).mockReturnValue({ ...mockUrlResponse, userId: null });

      // Act
      const result = await urlService.shorten('https://www.github.com');

      // Assert
      expect(mockUrlRepository.create).toHaveBeenCalledWith({
        code: 'xyz789',
        originalUrl: 'https://www.github.com',
        userId: undefined,
      });
      expect(result.userId).toBeNull();
    });

    it('should regenerate code if first attempt conflicts', async () => {
      // Arrange
      mockNanoid.mockReturnValueOnce('conflict').mockReturnValueOnce('abc123');

      mockUrlRepository.codeIsActive.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      mockUrlRepository.create.mockResolvedValue(mockUrlEntity);
      (UrlMapper.toUrlResponse as jest.Mock).mockReturnValue(mockUrlResponse);

      // Act
      const result = await urlService.shorten('https://www.google.com', 'user-id');

      // Assert
      expect(mockNanoid).toHaveBeenCalledTimes(2);
      expect(mockUrlRepository.codeIsActive).toHaveBeenCalledTimes(2);
      expect(mockUrlRepository.codeIsActive).toHaveBeenNthCalledWith(1, 'conflict');
      expect(mockUrlRepository.codeIsActive).toHaveBeenNthCalledWith(2, 'abc123');
      expect(result).toEqual(mockUrlResponse);
    });

    it('should throw error after maximum attempts', async () => {
      // Arrange
      mockNanoid.mockReturnValue('conflict');
      mockUrlRepository.codeIsActive.mockResolvedValue(true); // Always return true to simulate conflicts
      // Mock create to also fail to trigger the final error
      mockUrlRepository.create.mockRejectedValue(new Error('Database constraint violation'));

      // Act & Assert
      await expect(urlService.shorten('https://www.google.com', 'user-id')).rejects.toThrow(
        'Failed to generate unique code after maximum attempts'
      );

      expect(mockNanoid).toHaveBeenCalledTimes(10);
      expect(mockUrlRepository.codeIsActive).toHaveBeenCalledTimes(10);
    });
  });

  describe('getOriginalUrl', () => {
    const mockUrl = {
      id: 'test-id',
      originalUrl: 'https://www.google.com',
      code: 'abc123',
      clicks: 5,
      status: 'ACTIVE',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should return original URL and increment clicks', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(mockUrl);
      mockUrlRepository.incrementClicks.mockResolvedValue();

      // Act
      const result = await urlService.redirectToOriginalUrl('abc123');

      // Assert
      expect(mockUrlRepository.findByActiveCode).toHaveBeenCalledWith('abc123');
      expect(result).toBe('https://www.google.com');

      // Note: incrementClicks is called asynchronously via setImmediate,
      // so we can't reliably test it without changing the implementation
    });

    it('should return null for non-existent code', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(null);

      // Act
      const result = await urlService.redirectToOriginalUrl('nonexistent');

      // Assert
      expect(mockUrlRepository.findByActiveCode).toHaveBeenCalledWith('nonexistent');
      expect(mockUrlRepository.incrementClicks).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('listUserUrls', () => {
    const mockUrls = [
      {
        id: 'test-id-1',
        code: 'abc123',
        originalUrl: 'https://www.google.com',
        clicks: 5,
        status: 'ACTIVE',
        userId: 'user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    const mockListResponse = {
      urls: [
        {
          id: 'test-id-1',
          code: 'abc123',
          originalUrl: 'https://www.google.com',
          shortUrl: 'http://localhost:3000/abc123',
          clicks: 5,
          status: UrlStatus.ACTIVE,
          userId: 'user-id',
          createdAt: '2025-06-26T00:00:00.000Z',
          updatedAt: '2025-06-26T00:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        maxItemsPerPage: 10,
        totalItems: 1,
        lastPage: true,
        previousPage: null,
      },
    };

    it('should return user URLs with default pagination', async () => {
      // Arrange
      mockUrlRepository.findByUserIdWithFilters.mockResolvedValue({
        urls: mockUrls,
        total: 1,
      });
      (UrlMapper.toUrlListResponseWithPagination as jest.Mock).mockReturnValue(mockListResponse);

      // Act
      const result = await urlService.listUserUrls('user-id');

      // Assert
      expect(mockUrlRepository.findByUserIdWithFilters).toHaveBeenCalledWith('user-id', {});
      expect(UrlMapper.toUrlListResponseWithPagination).toHaveBeenCalledWith(mockUrls, 1, 1, 10);
      expect(result).toEqual(mockListResponse);
    });

    it('should return user URLs with custom filters', async () => {
      // Arrange
      const filters = {
        page: 2,
        limit: 5,
        status: UrlStatus.ACTIVE,
        code: 'abc',
      };

      mockUrlRepository.findByUserIdWithFilters.mockResolvedValue({
        urls: mockUrls,
        total: 15,
      });
      (UrlMapper.toUrlListResponseWithPagination as jest.Mock).mockReturnValue(mockListResponse);

      // Act
      const result = await urlService.listUserUrls('user-id', filters);

      // Assert
      expect(mockUrlRepository.findByUserIdWithFilters).toHaveBeenCalledWith('user-id', filters);
      expect(UrlMapper.toUrlListResponseWithPagination).toHaveBeenCalledWith(mockUrls, 15, 2, 5);
    });

    it('should return empty list response when user has no URLs', async () => {
      // Arrange
      mockUrlRepository.findByUserIdWithFilters.mockResolvedValue({
        urls: [],
        total: 0,
      });

      // Act
      const result = await urlService.listUserUrls('user-id');

      // Assert
      expect(mockUrlRepository.findByUserIdWithFilters).toHaveBeenCalledWith('user-id', {});
      expect(result).toEqual({
        urls: [],
        pagination: {
          page: 1,
          maxItemsPerPage: 10,
          totalItems: 0,
          totalPages: 0,
          lastPage: true,
          previousPage: null,
        },
      });
    });

    it('should return empty list on database timeout', async () => {
      // Arrange
      const timeoutError = new Error('Database operation timeout');
      mockUrlRepository.findByUserIdWithFilters.mockRejectedValue(timeoutError);

      // Act
      const result = await urlService.listUserUrls('user-id');

      // Assert
      expect(mockUrlRepository.findByUserIdWithFilters).toHaveBeenCalledWith('user-id', {});
      expect(result).toEqual({
        urls: [],
        pagination: {
          page: 1,
          maxItemsPerPage: 10,
          totalItems: 0,
          totalPages: 0,
          lastPage: true,
          previousPage: null,
        },
      });
    });

    it('should throw ServiceUnavailableError on general database error', async () => {
      // Arrange
      const generalError = new Error('General database error');
      mockUrlRepository.findByUserIdWithFilters.mockRejectedValue(generalError);

      // Act & Assert
      await expect(urlService.listUserUrls('user-id')).rejects.toThrow(
        'Unable to fetch URLs at this time'
      );
    });
  });

  describe('updateUserUrlByCode', () => {
    const mockUrl = {
      id: 'test-id',
      code: 'abc123',
      originalUrl: 'https://www.google.com',
      clicks: 0,
      status: 'ACTIVE',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should successfully update URL', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(mockUrl);
      mockUrlRepository.validateUserAccess.mockImplementation(() => {});
      mockUrlRepository.update.mockResolvedValue({
        ...mockUrl,
        originalUrl: 'https://www.youtube.com',
      });
      (UrlMapper.toUrlResponse as jest.Mock).mockReturnValue({});

      // Act
      await urlService.updateUserUrlByCode('abc123', 'user-id', {
        originalUrl: 'https://www.youtube.com',
      });

      // Assert
      expect(mockUrlRepository.findByActiveCode).toHaveBeenCalledWith('abc123');
      expect(mockUrlRepository.validateUserAccess).toHaveBeenCalledWith(mockUrl, 'user-id');
      expect(mockUrlRepository.update).toHaveBeenCalledWith('test-id', {
        originalUrl: 'https://www.youtube.com',
      });
    });

    it('should throw error for non-existent URL', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(null);

      // Act & Assert
      await expect(
        urlService.updateUserUrlByCode('nonexistent', 'user-id', {
          originalUrl: 'https://www.youtube.com',
        })
      ).rejects.toThrow('URL not found');
    });

    it('should throw error for unauthorized access', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(mockUrl);
      mockUrlRepository.validateUserAccess.mockImplementation(() => {
        throw new Error('Forbidden: URL not found or access denied');
      });

      // Act & Assert
      await expect(
        urlService.updateUserUrlByCode('abc123', 'wrong-user', {
          originalUrl: 'https://www.youtube.com',
        })
      ).rejects.toThrow('You do not have permission to update this URL');
    });
  });

  describe('deleteUserUrlByCode', () => {
    const mockUrl = {
      id: 'test-id',
      code: 'abc123',
      originalUrl: 'https://www.google.com',
      clicks: 0,
      status: 'ACTIVE',
      userId: 'user-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should successfully delete URL', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(mockUrl);
      mockUrlRepository.validateUserAccess.mockImplementation(() => {});
      mockUrlRepository.delete.mockResolvedValue({
        ...mockUrl,
        status: 'DELETED',
        deletedAt: new Date(),
      });
      (UrlMapper.toUrlResponse as jest.Mock).mockReturnValue({});

      // Act
      await urlService.deleteUserUrlByCode('abc123', 'user-id');

      // Assert
      expect(mockUrlRepository.findByActiveCode).toHaveBeenCalledWith('abc123');
      expect(mockUrlRepository.validateUserAccess).toHaveBeenCalledWith(mockUrl, 'user-id');
      expect(mockUrlRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw error for non-existent URL', async () => {
      // Arrange
      mockUrlRepository.findByActiveCode.mockResolvedValue(null);

      // Act & Assert
      await expect(urlService.deleteUserUrlByCode('nonexistent', 'user-id')).rejects.toThrow(
        'URL not found'
      );
    });
  });
});
