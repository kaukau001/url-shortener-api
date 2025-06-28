import { UrlMapper } from '../../../app/mappers/url.mapper';
import { UrlStatus } from '../../../app/types';

describe('UrlMapper', () => {
  beforeEach(() => {
    delete process.env.BASE_URL;
  });

  afterEach(() => {
    delete process.env.BASE_URL;
  });

  describe('toUrlResponse', () => {
    const mockPrismaUrl = {
      id: 'test-id',
      code: 'abc123',
      originalUrl: 'https://www.google.com',
      clicks: 5,
      status: 'ACTIVE',
      userId: 'user-id',
      createdAt: new Date('2025-06-26T10:00:00.000Z'),
      updatedAt: new Date('2025-06-26T12:00:00.000Z'),
      deletedAt: null,
    };

    it('should map Prisma URL to UrlResponse with default base URL', () => {
      // Act
      const result = UrlMapper.toUrlResponse(mockPrismaUrl);

      // Assert
      expect(result).toEqual({
        id: 'test-id',
        code: 'abc123',
        originalUrl: 'https://www.google.com',
        shortUrl: 'http://localhost:3000/abc123',
        clicks: 5,
        status: UrlStatus.ACTIVE,
        userId: 'user-id',
        createdAt: '2025-06-26T10:00:00.000Z',
        updatedAt: '2025-06-26T12:00:00.000Z',
        deletedAt: undefined,
      });
    });

    it('should map Prisma URL to UrlResponse with custom base URL', () => {
      // Arrange
      process.env.BASE_URL = 'https://short.ly';

      // Act
      const result = UrlMapper.toUrlResponse(mockPrismaUrl);

      // Assert
      expect(result).toEqual({
        id: 'test-id',
        code: 'abc123',
        originalUrl: 'https://www.google.com',
        shortUrl: 'https://short.ly/abc123',
        clicks: 5,
        status: UrlStatus.ACTIVE,
        userId: 'user-id',
        createdAt: '2025-06-26T10:00:00.000Z',
        updatedAt: '2025-06-26T12:00:00.000Z',
        deletedAt: undefined,
      });
    });

    it('should handle URL with null userId', () => {
      // Arrange
      const urlWithoutUser = { ...mockPrismaUrl, userId: null };

      // Act
      const result = UrlMapper.toUrlResponse(urlWithoutUser);

      // Assert
      expect(result.userId).toBeNull();
    });

    it('should handle deleted URL with deletedAt date', () => {
      // Arrange
      const deletedUrl = {
        ...mockPrismaUrl,
        status: 'DELETED',
        deletedAt: new Date('2025-06-26T15:00:00.000Z'),
      };

      // Act
      const result = UrlMapper.toUrlResponse(deletedUrl);

      // Assert
      expect(result.status).toBe(UrlStatus.DELETED);
      expect(result.deletedAt).toBe('2025-06-26T15:00:00.000Z');
    });
  });

  describe('toUrlListResponseWithPagination', () => {
    const mockPrismaUrls = [
      {
        id: 'test-id-1',
        code: 'abc123',
        originalUrl: 'https://www.google.com',
        clicks: 5,
        status: 'ACTIVE',
        userId: 'user-id',
        createdAt: new Date('2025-06-26T10:00:00.000Z'),
        updatedAt: new Date('2025-06-26T12:00:00.000Z'),
        deletedAt: null,
      },
      {
        id: 'test-id-2',
        code: 'xyz789',
        originalUrl: 'https://www.github.com',
        clicks: 10,
        status: 'ACTIVE',
        userId: 'user-id',
        createdAt: new Date('2025-06-26T11:00:00.000Z'),
        updatedAt: new Date('2025-06-26T13:00:00.000Z'),
        deletedAt: null,
      },
    ];

    it('should map URLs list with pagination for first page', () => {
      // Act
      const result = UrlMapper.toUrlListResponseWithPagination(mockPrismaUrls, 15, 1, 10);

      // Assert
      expect(result.urls).toHaveLength(2);
      expect(result.urls[0].code).toBe('abc123');
      expect(result.urls[1].code).toBe('xyz789');
      expect(result.pagination).toEqual({
        page: 1,
        previousPage: null,
        maxItemsPerPage: 10,
        totalItems: 15,
        totalPages: 2,
        lastPage: false,
      });
    });

    it('should map URLs list with pagination for last page', () => {
      // Act
      const result = UrlMapper.toUrlListResponseWithPagination(mockPrismaUrls, 12, 2, 10);

      // Assert
      expect(result.urls).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 2,
        previousPage: 1,
        maxItemsPerPage: 10,
        totalItems: 12,
        totalPages: 2,
        lastPage: true,
      });
    });

    it('should handle empty URLs list', () => {
      // Act
      const result = UrlMapper.toUrlListResponseWithPagination([], 0, 1, 10);

      // Assert
      expect(result.urls).toHaveLength(0);
      expect(result.pagination).toEqual({
        page: 1,
        previousPage: null,
        maxItemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
        lastPage: true,
      });
    });

    it('should calculate pagination correctly for exact page division', () => {
      // Act - total of 20 items, 10 per page, page 2
      const result = UrlMapper.toUrlListResponseWithPagination(mockPrismaUrls, 20, 2, 10);

      // Assert
      expect(result.pagination).toEqual({
        page: 2,
        previousPage: 1,
        maxItemsPerPage: 10,
        totalItems: 20,
        totalPages: 2,
        lastPage: true,
      });
    });

    it('should handle single item with large page size', () => {
      // Arrange
      const singleUrl = [mockPrismaUrls[0]];

      // Act
      const result = UrlMapper.toUrlListResponseWithPagination(singleUrl, 1, 1, 50);

      // Assert
      expect(result.urls).toHaveLength(1);
      expect(result.pagination).toEqual({
        page: 1,
        previousPage: null,
        maxItemsPerPage: 50,
        totalItems: 1,
        totalPages: 1,
        lastPage: true,
      });
    });

    it('should set previousPage to null for first page', () => {
      // Act
      const result = UrlMapper.toUrlListResponseWithPagination(mockPrismaUrls, 50, 1, 10);

      // Assert
      expect(result.pagination.previousPage).toBe(null);
    });

    it('should calculate previousPage correctly for middle pages', () => {
      // Act
      const result = UrlMapper.toUrlListResponseWithPagination(mockPrismaUrls, 50, 3, 10);

      // Assert
      expect(result.pagination.previousPage).toBe(2);
      expect(result.pagination.page).toBe(3);
    });

    it('should calculate previousPage correctly for last page', () => {
      // Act
      const result = UrlMapper.toUrlListResponseWithPagination(mockPrismaUrls, 25, 3, 10);

      // Assert
      expect(result.pagination.previousPage).toBe(2);
      expect(result.pagination.page).toBe(3);
      expect(result.pagination.lastPage).toBe(true);
    });
  });
});
