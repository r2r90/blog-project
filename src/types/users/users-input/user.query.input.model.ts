import { SortDirection } from "mongodb";

export type UserQueryInputModel = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type UserSortData = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
