import { UrlResponse, UrlListResponse, UrlStatus, PaginationInfo } from '../types';

type PrismaShortUrl = {
  id: string;
  code: string;
  originalUrl: string;
  clicks: number;
  status: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export class UrlMapper {
  private static getBaseUrl(): string {
    return process.env.BASE_URL || 'http://localhost:3000';
  }

  static toUrlResponse(shortUrl: PrismaShortUrl): UrlResponse {
    return {
      id: shortUrl.id,
      code: shortUrl.code,
      originalUrl: shortUrl.originalUrl,
      shortUrl: `${this.getBaseUrl()}/${shortUrl.code}`,
      clicks: shortUrl.clicks,
      status: shortUrl.status as UrlStatus,
      userId: shortUrl.userId,
      createdAt: shortUrl.createdAt.toISOString(),
      updatedAt: shortUrl.updatedAt.toISOString(),
      deletedAt: shortUrl.deletedAt?.toISOString(),
    };
  }
  static toUrlListResponseWithPagination(
    shortUrls: PrismaShortUrl[],
    total: number,
    page: number,
    limit: number
  ): UrlListResponse {
    const urls = shortUrls.map(url => this.toUrlResponse(url));
    const totalPages = Math.ceil(total / limit);
    const isLastPage = page >= totalPages;

    const pagination: PaginationInfo = {
      page,
      previousPage: page > 1 ? page - 1 : null,
      maxItemsPerPage: limit,
      totalItems: total,
      totalPages,
      lastPage: isLastPage,
    };

    return {
      urls,
      pagination,
    };
  }
}
