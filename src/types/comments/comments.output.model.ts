export type CommentViewModel = {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type CommentsGetResponse = {
  pageCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
};
