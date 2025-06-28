import { PrismaClient } from '@prisma/client';
import { UrlEntity } from '../url/url.entity';
import { UrlStatusEnum } from '../url/url-status.enum';
import { UrlFilters } from '../../types';

interface RepositoryConfig {
  defaultTimeout?: number;
  createTimeout?: number;
  updateTimeout?: number;
  findTimeout?: number;
}

export class UrlRepository {
  private config: Required<RepositoryConfig>;

  constructor(
    private prisma: PrismaClient,
    config: RepositoryConfig = {}
  ) {
    this.config = {
      defaultTimeout: config.defaultTimeout || 5000,
      createTimeout: config.createTimeout || config.defaultTimeout || 5000,
      updateTimeout: config.updateTimeout || config.defaultTimeout || 3000,
      findTimeout: config.findTimeout || config.defaultTimeout || 3000,
    };
  }

  private withTimeout<T>(promise: Promise<T>, timeout: number, operation: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Database timeout: ${operation} took longer than ${timeout}ms`)),
          timeout
        )
      ),
    ]);
  }

  async create(data: { code: string; originalUrl: string; userId?: string }): Promise<UrlEntity> {
    return this.withTimeout(
      this.prisma.shortUrl.create({ data }),
      this.config.createTimeout,
      'create URL'
    );
  }

  async findByActiveCode(code: string): Promise<UrlEntity | null> {
    return this.withTimeout(
      this.prisma.shortUrl.findFirst({
        where: { code, status: UrlStatusEnum.ACTIVE },
      }),
      this.config.findTimeout,
      'find by active code'
    );
  }

  async codeIsActive(code: string): Promise<boolean> {
    // Verifica se o código está em uso (status ACTIVE)
    // Códigos deletados podem ser reutilizados
    const url = await this.withTimeout(
      this.prisma.shortUrl.findFirst({
        where: { code, status: UrlStatusEnum.ACTIVE },
        select: { id: true },
      }),
      this.config.findTimeout,
      'check if code is active'
    );
    return !!url;
  }

  async findExistingCodeForReuse(code: string): Promise<UrlEntity | null> {
    return this.withTimeout(
      this.prisma.shortUrl.findFirst({
        where: { code, status: UrlStatusEnum.DELETED },
      }),
      this.config.findTimeout,
      'find existing code for reuse'
    );
  }

  async findById(id: string): Promise<UrlEntity | null> {
    return this.withTimeout(
      this.prisma.shortUrl.findUnique({ where: { id } }),
      this.config.findTimeout,
      'find by ID'
    );
  }

  async findByUserId(userId: string): Promise<UrlEntity[]> {
    return this.withTimeout(
      this.prisma.shortUrl.findMany({
        where: { userId },
      }),
      this.config.findTimeout,
      'find by user ID'
    );
  }

  async findByUserIdWithFilters(
    userId: string,
    filters: UrlFilters
  ): Promise<{ urls: UrlEntity[]; total: number }> {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(20, Math.max(1, filters.limit || 10));
    const skip = (page - 1) * limit;

    const whereConditions: any = {
      userId,
    };
    if (filters.status) {
      whereConditions.status =
        filters.status === 'ACTIVE' ? UrlStatusEnum.ACTIVE : UrlStatusEnum.DELETED;
    }
    if (filters.code) {
      whereConditions.code = {
        contains: filters.code,
      };
    }
    if (filters.id) {
      whereConditions.id = filters.id;
    }
    if (filters.startDate || filters.endDate) {
      whereConditions.createdAt = {};

      if (filters.startDate) {
        whereConditions.createdAt.gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        whereConditions.createdAt.lte = new Date(filters.endDate);
      }
    }
    const [urls, total] = await this.withTimeout(
      Promise.all([
        this.prisma.shortUrl.findMany({
          where: whereConditions,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.shortUrl.count({
          where: whereConditions,
        }),
      ]),
      this.config.findTimeout,
      'find by user ID with filters'
    );

    return { urls, total };
  }

  async incrementClicks(id: string): Promise<void> {
    await this.withTimeout(
      this.prisma.shortUrl.update({
        where: { id },
        data: { clicks: { increment: 1 } },
      }),
      2000,
      'increment clicks'
    );
  }

  async update(
    id: string,
    data: { originalUrl?: string; status?: UrlStatusEnum; deletedAt?: Date }
  ): Promise<UrlEntity> {
    return this.withTimeout(
      this.prisma.shortUrl.update({
        where: { id },
        data,
      }),
      this.config.updateTimeout,
      'update URL'
    );
  }

  async updateCode(id: string, code: string): Promise<UrlEntity> {
    // Agora que removemos a constraint unique simples do código,
    // podemos simplesmente atualizar sem se preocupar com códigos deletados
    return this.withTimeout(
      this.prisma.shortUrl.update({
        where: { id },
        data: { code },
      }),
      this.config.updateTimeout,
      'update URL code'
    );
  }

  async delete(id: string): Promise<UrlEntity> {
    return this.update(id, {
      status: UrlStatusEnum.DELETED,
      deletedAt: new Date(),
    });
  }

  validateUserAccess(url: UrlEntity | null, userId: string): void {
    if (!url || url.userId !== userId || url.status === UrlStatusEnum.DELETED) {
      throw new Error('Access denied: URL not found or user not authorized');
    }
  }
}
