import { SortDirection } from "mongodb";

export type PostQueryInputModel = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
};
