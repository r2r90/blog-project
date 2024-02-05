import { SortDirection } from "mongodb";

export type BlogQueryInputModel = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
};
