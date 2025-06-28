export interface PaginationInfo {
  page: number;
  previousPage: number | null;
  maxItemsPerPage: number;
  totalItems: number;
  totalPages: number;
  lastPage: boolean;
}
