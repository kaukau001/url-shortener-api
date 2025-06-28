import { UrlService } from '../../../app/service/url.service';
import { UrlStatusEnum } from '../../../app/repository/url/url-status.enum';

jest.mock('../../../app/repository/url/url.repository');
jest.mock('../../../app/mappers/url.mapper');
jest.mock('../../../app/utils/logger.util');

const mockUrlRepository = {
  findByActiveCode: jest.fn(),
  validateUserAccess: jest.fn(),
  codeIsActive: jest.fn(),
  updateCode: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findByUserIdWithFilters: jest.fn(),
  incrementClicks: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as any;

const mockUrlMapper = {
  toUrlResponse: jest.fn(),
  toUrlListResponseWithPagination: jest.fn(),
} as any;

describe('UrlService - updateUserUrlCode', () => {
  let urlService: UrlService;

  beforeEach(() => {
    jest.clearAllMocks();
    urlService = new UrlService();
    (urlService as any).urlRepository = mockUrlRepository;
  });

  const mockUrl = {
    id: 'url-id-123',
    code: 'oldCode',
    originalUrl: 'https://example.com',
    userId: 'user-123',
    status: UrlStatusEnum.ACTIVE,
    clicks: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockUpdatedUrl = {
    ...mockUrl,
    code: 'newCode',
    updatedAt: new Date(),
  };

  const mockUrlResponse = {
    id: 'url-id-123',
    code: 'newCode',
    originalUrl: 'https://example.com',
    shortUrl: 'http://localhost:3000/newCode',
    clicks: 0,
    status: UrlStatusEnum.ACTIVE,
    userId: 'user-123',
    createdAt: mockUrl.createdAt.toISOString(),
    updatedAt: mockUpdatedUrl.updatedAt.toISOString(),
    deletedAt: null,
  };

  describe('successful code update', () => {
    beforeEach(() => {
      const UrlMapper = require('../../../app/mappers/url.mapper').UrlMapper;
      mockUrlRepository.findByActiveCode.mockResolvedValue(mockUrl);
      mockUrlRepository.validateUserAccess.mockReturnValue(undefined);
      mockUrlRepository.codeIsActive.mockResolvedValue(false);
      mockUrlRepository.updateCode.mockResolvedValue(mockUpdatedUrl);
      UrlMapper.toUrlResponse = jest.fn().mockReturnValue(mockUrlResponse);
    });

    it('should update URL code successfully', async () => {
      const result = await urlService.updateUserUrlCode('oldCode', 'newCode', 'user-123');

      expect(mockUrlRepository.findByActiveCode).toHaveBeenCalledWith('oldCode');
      expect(mockUrlRepository.validateUserAccess).toHaveBeenCalledWith(mockUrl, 'user-123');
      expect(mockUrlRepository.codeIsActive).toHaveBeenCalledWith('newCode');
      expect(mockUrlRepository.updateCode).toHaveBeenCalledWith('url-id-123', 'newCode');
      expect(result).toEqual(mockUrlResponse);
    });
  });

  describe('business logic errors', () => {
    beforeEach(() => {
      mockUrlRepository.findByActiveCode.mockResolvedValue(mockUrl);
      mockUrlRepository.validateUserAccess.mockReturnValue(undefined);
    });

    it('should throw error when original URL not found', async () => {
      mockUrlRepository.findByActiveCode.mockResolvedValue(null);

      await expect(urlService.updateUserUrlCode('oldCode', 'newCode', 'user-123')).rejects.toThrow(
        'Original URL not found'
      );
    });

    it('should throw error when access denied', async () => {
      mockUrlRepository.validateUserAccess.mockImplementation(() => {
        throw new Error('Access denied');
      });

      await expect(urlService.updateUserUrlCode('oldCode', 'newCode', 'user-123')).rejects.toThrow(
        'You do not have permission to update this URL code'
      );
    });

    it('should throw error when new code already exists', async () => {
      mockUrlRepository.codeIsActive.mockResolvedValue(true);

      await expect(urlService.updateUserUrlCode('oldCode', 'newCode', 'user-123')).rejects.toThrow(
        'New code is already in use'
      );
    });
  });
});
