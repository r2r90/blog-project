export type BlogOutputType = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  websiteUrl: string;
  isMembership: boolean;
};

export type BlogPagination<I> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
};
