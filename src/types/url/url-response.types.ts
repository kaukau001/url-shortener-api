import { UrlStatusEnum } from '../../app/repository/url/url-status.enum';

export interface UrlResponse {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: UrlStatusEnum;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
