export type UrlEntity = {
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
