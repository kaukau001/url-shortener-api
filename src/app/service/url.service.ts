import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { UrlResponse, UrlListResponse, UpdateUrlRequest, UrlFilters } from '../types';
import { UrlMapper } from '../mappers/url.mapper';
import { UrlRepository } from '../repository/url/url.repository';
import { Logger } from '../utils/logger.util';
import {
  ValidationError,
  NotFoundError,
  AccessDeniedError,
  ConflictError,
  ServiceUnavailableError,
  CodeGenerationError,
} from '../errors/custom-errors';

export class UrlService {
  private urlRepository: UrlRepository;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.urlRepository = new UrlRepository(this.prisma, {
      defaultTimeout: 5000,
      createTimeout: 5000,
      updateTimeout: 3000,
      findTimeout: 3000,
    });
  }
  async shorten(originalUrl: string, userId?: string): Promise<UrlResponse> {
    try {
      const code = await this.generateUniqueCode();
      const shortUrl = await this.urlRepository.create({
        code,
        originalUrl: originalUrl.trim(),
        userId,
      });

      return UrlMapper.toUrlResponse(shortUrl);
    } catch (error: any) {
      Logger.error(
        'Error in shorten method',
        {
          action: 'shorten-url',
          originalUrl: originalUrl?.substring(0, 50),
          userId,
          errorMessage: error.message,
        },
        error
      );

      if (
        error instanceof ValidationError ||
        error instanceof CodeGenerationError ||
        error instanceof ServiceUnavailableError
      ) {
        throw error;
      }
      throw new ServiceUnavailableError('URL shortening temporarily unavailable');
    }
  }
  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;
    do {
      code = nanoid(6);
      attempts++;
      if (attempts > maxAttempts) {
        throw new CodeGenerationError(
          'Unable to generate unique short code after multiple attempts'
        );
      }
      const isActive = await this.urlRepository.codeIsActive(code);
      if (!isActive) {
        return code;
      }
      Logger.warn(`Code collision detected on attempt ${attempts}`, {
        action: 'generate-short-code',
        attempt: attempts,
        code,
      });
    } while (attempts < maxAttempts);
    throw new CodeGenerationError('Failed to generate unique code after maximum attempts');
  }

  async redirectToOriginalUrl(code: string): Promise<string | null> {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      Logger.warn('Invalid code provided to getOriginalUrl', {
        action: 'get-original-url-validation',
        code: typeof code === 'string' ? code : typeof code,
      });
      return null;
    }

    const cleanCode = code.trim();

    try {
      const short = await this.urlRepository.findByActiveCode(cleanCode);

      if (!short) {
        Logger.info('URL not found for code', {
          action: 'get-original-url',
          code: cleanCode,
        });
        return null;
      }
      this.incrementClicks(short.id);
      return short.originalUrl;
    } catch (error: any) {
      Logger.error(
        'Failed to get original URL',
        {
          action: 'get-original-url',
          code: cleanCode,
          errorType: error.constructor.name,
          errorMessage: error.message,
        },
        error
      );

      if (error.message.includes('timeout')) {
        Logger.warn('Database timeout in getOriginalUrl, returning null', {
          action: 'get-original-url-timeout',
          code: cleanCode,
        });
        return null;
      }
      // Para redirecionamentos, é melhor retornar null que quebrar
      // O controller pode decidir como lidar (404 vs página de erro)
      return null;
    }
  }

  private async incrementClicks(urlId: string): Promise<void> {
    try {
      setImmediate(async () => {
        try {
          await this.urlRepository.incrementClicks(urlId);
        } catch (error: any) {
          Logger.warn('Non-critical: Failed to increment clicks', {
            action: 'increment-clicks',
            urlId,
            errorMessage: error.message,
          });
        }
      });
    } catch (error) {}
  }

  async listUserUrls(userId: string, filters: UrlFilters = {}): Promise<UrlListResponse> {
    const cleanUserId = userId.trim();
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(20, Math.max(1, filters.limit || 10));

    try {
      const result = await this.urlRepository.findByUserIdWithFilters(cleanUserId, filters);

      // Se o usuário existe mas não tem URLs, retornamos uma lista vazia corretamente formatada
      if (result.urls.length === 0) {
        return this.createEmptyUrlListResponse(page, limit);
      }

      return UrlMapper.toUrlListResponseWithPagination(result.urls, result.total, page, limit);
    } catch (error: any) {
      Logger.error(
        'Failed to list user URLs',
        {
          action: 'list-user-urls',
          userId: cleanUserId,
          errorType: error.constructor.name,
          errorMessage: error.message,
        },
        error
      );

      // Repassamos erros de validação
      if (error instanceof ValidationError) {
        throw error;
      }

      // Tratamento especial para timeouts de banco de dados
      if (error.message.includes('timeout')) {
        Logger.warn('Database timeout in listUserUrls', {
          action: 'list-user-urls-timeout',
          userId: cleanUserId,
        });
        // Em caso de timeout, retornamos resposta vazia em vez de erro
        return this.createEmptyUrlListResponse(page, limit);
      }

      // Para outros erros, lançamos um erro genérico de serviço
      throw new ServiceUnavailableError('Unable to fetch URLs at this time');
    }
  }

  /**
   * Cria uma resposta vazia com paginação correta
   * @param page Página atual
   * @param limit Limite de itens por página
   * @returns UrlListResponse com lista vazia e paginação adequada
   */
  private createEmptyUrlListResponse(page: number, limit: number): UrlListResponse {
    return {
      urls: [],
      pagination: {
        page,
        maxItemsPerPage: limit,
        totalItems: 0,
        totalPages: 0,
        lastPage: true,
        previousPage: page > 1 ? page - 1 : null,
      },
    };
  }

  async updateUserUrlByCode(
    code: string,
    userId: string,
    dto: UpdateUrlRequest
  ): Promise<UrlResponse> {
    const cleanCode = code.trim();
    const cleanUserId = userId.trim();

    try {
      const url = await this.urlRepository.findByActiveCode(cleanCode);

      if (!url) {
        throw new NotFoundError('URL not found');
      }

      try {
        this.urlRepository.validateUserAccess(url, cleanUserId);
      } catch (accessError: any) {
        throw new AccessDeniedError('You do not have permission to update this URL');
      }

      const updatedUrl = await this.urlRepository.update(url.id, {
        originalUrl: dto.originalUrl.trim(),
      });

      return UrlMapper.toUrlResponse(updatedUrl);
    } catch (error: any) {
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof AccessDeniedError
      ) {
        throw error;
      }

      Logger.error(
        'Failed to update user URL',
        {
          action: 'update-user-url',
          userId: cleanUserId,
          code: cleanCode,
          errorType: error.constructor.name,
          errorMessage: error.message,
        },
        error
      );

      if (error.message.includes('timeout')) {
        throw new ServiceUnavailableError('Update operation timed out, please try again');
      }
      throw new ServiceUnavailableError('Unable to update URL at this time');
    }
  }

  async deleteUserUrlByCode(code: string, userId: string): Promise<UrlResponse> {
    try {
      const url = await this.urlRepository.findByActiveCode(code);

      if (!url) {
        throw new NotFoundError('URL not found');
      }
      try {
        this.urlRepository.validateUserAccess(url, userId);
      } catch (accessError: any) {
        throw new AccessDeniedError('You do not have permission to delete this URL');
      }
      const deletedUrl = await this.urlRepository.delete(url.id);
      return UrlMapper.toUrlResponse(deletedUrl);
    } catch (error: any) {
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof AccessDeniedError
      ) {
        throw error;
      }
      Logger.error(
        'Failed to delete user URL',
        {
          action: 'delete-user-url',
          userId: userId,
          code: code,
          errorType: error.constructor.name,
          errorMessage: error.message,
        },
        error
      );
      if (error.message.includes('timeout')) {
        throw new ServiceUnavailableError('Delete operation timed out, please try again');
      }
      throw new ServiceUnavailableError('Unable to delete URL at this time');
    }
  }

  async updateUserUrlCode(
    originalCode: string,
    newCode: string,
    userId: string
  ): Promise<UrlResponse> {
    const cleanNewCode = newCode.trim();
    try {
      Logger.info('Starting URL code update', {
        action: 'update-user-url-code-start',
        userId: userId,
        originalCode: originalCode,
        newCode: cleanNewCode,
      });

      const originalUrl = await this.urlRepository.findByActiveCode(originalCode);
      if (!originalUrl) {
        throw new NotFoundError('Original URL not found');
      }

      try {
        this.urlRepository.validateUserAccess(originalUrl, userId);
      } catch (accessError: any) {
        throw new AccessDeniedError('You do not have permission to update this URL code');
      }

      const isNewCodeActive = await this.urlRepository.codeIsActive(cleanNewCode);
      if (isNewCodeActive) {
        Logger.warn('Attempted to use active code', {
          action: 'update-user-url-code-conflict',
          userId: userId,
          originalCode: originalCode,
          newCode: cleanNewCode,
        });
        throw new ConflictError('New code is already in use');
      }

      const updatedUrl = await this.urlRepository.updateCode(originalUrl.id, cleanNewCode);
      Logger.info('URL code updated successfully', {
        action: 'update-user-url-code-success',
        userId: userId,
        originalCode: originalCode,
        newCode: cleanNewCode,
      });
      return UrlMapper.toUrlResponse(updatedUrl);
    } catch (error: any) {
      Logger.error(
        'Failed to update URL code',
        {
          action: 'update-user-url-code-error',
          userId: userId,
          originalCode: originalCode,
          newCode: cleanNewCode,
          errorType: error.constructor.name,
          errorMessage: error.message,
        },
        error
      );

      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof ConflictError ||
        error instanceof AccessDeniedError
      ) {
        throw error;
      }

      // Tratamento específico para erro de constraint unique
      if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
        Logger.error('Unique constraint violation on code field', {
          action: 'update-user-url-code-constraint',
          userId: userId,
          originalCode: originalCode,
          newCode: cleanNewCode,
          constraintFields: error.meta.target,
        });
        throw new ConflictError('Code is already in use');
      }

      if (error.message.includes('timeout')) {
        throw new ServiceUnavailableError('Update operation timed out, please try again');
      }
      throw new ServiceUnavailableError('Unable to update URL code at this time');
    }
  }
}
