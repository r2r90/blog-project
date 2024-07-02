import mongoose from "mongoose";

export type CommentDbType = {
  content: string;
  createdAt: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: LikesInfoViewModel;
};

export type LikesInfoViewModel = {
  likesCount: number;
  disLikesCount: number;
  myStatus: LikeStatus;
};

export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

const CommentsSchema = new mongoose.Schema<CommentDbType>({
  content: { type: String },
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
        userid: { type: String, required: true },
        likesStatus: { type: String, required: true },
      },
    ],
  },
});

export const CommentsModel = mongoose.model("comments", CommentsSchema);
