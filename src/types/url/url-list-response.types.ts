import { UrlResponse } from './url-response.types';
import { PaginationInfo } from './pagination-info.types';

export interface UrlListResponse {
  urls: UrlResponse[];
  pagination: PaginationInfo;
}
