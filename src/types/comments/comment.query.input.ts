import { SortDirection } from "mongodb";

export type CommentQueryInputModel = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
};

export type CommentSortData = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
