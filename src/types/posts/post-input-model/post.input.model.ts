export type PostCreateInputType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostUpdateInputType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type NewestLikesInputType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type UserLiked = {
  likedUserId: string;
  likesStatus: string;
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikesInputType[];
  usersLiked: UserLiked[];
  blacklist: string[];
};
