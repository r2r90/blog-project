export type CommentsOutputModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoModel;
  createdAt: string;
};

export type CommentatorInfoModel = {
  userId: string;
  userLogin: string;
};
