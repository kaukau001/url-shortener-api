import { UrlStatusEnum } from '../../app/repository/url/url-status.enum';

export interface UrlFilters {
  page?: number;
  limit?: number;
  status?: UrlStatusEnum;
  code?: string;
  id?: string;
  startDate?: string;
  endDate?: string;
}
