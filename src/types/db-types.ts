export type UserDbType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

export type PostDbType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type BlogDbType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type CommentDbType = {
  content: string;
  createdAt: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};
