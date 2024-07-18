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
  likedUserId: string;
  likesStatus: string;
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikesInputType[];
  usersLiked: NewestLikesInputType[];
  blacklist: string[];
};
