import mongoose from "mongoose";

export class CommentDBType {
  constructor(
    public content: string,
    public createdAt: string,
    public postId: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      usersLiked?: {
        likedUserId: string;
        likesStatus: LikeStatus;
      }[];
    }
  ) {}
}

const CommentsSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  likesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    usersLiked: [
      {
        likedUserId: { type: String, required: true },
        likesStatus: { type: String, required: true },
      },
    ],
  },
});

export type LikesInfoViewModel = {
  usersLiked: any;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export const CommentsModel = mongoose.model<CommentDBType>(
  "comments",
  CommentsSchema
);
