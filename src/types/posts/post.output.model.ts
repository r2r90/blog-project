import { LikeStatus } from "../../db/schemas/comments-schema";

export type PostOutputType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;
};

export type PostPagination<I> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostOutputType[];
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikesInfoType[];
};

export type NewestLikesInfoType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type UserLikedInfoType = {
  addedAt: string;
  userId: string;
  login: string;
  likedStatus: string;
};
