import mongoose from "mongoose";
import { LikeStatus } from "./comments-schema";

export type PostDbType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: [];
  };
};

const PostsSchema = new mongoose.Schema<PostDbType>({
  title: { type: String, required: true, maxlength: 30 },
  shortDescription: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 1000 },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  extendedLikesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    myStatus: { type: String, default: "None" },
    newestLikes: [
      {
        addedAt: { type: String },
        userId: { type: String },
        login: { type: String },
      },
    ],
  },
});

export const PostsModel = mongoose.model("posts", PostsSchema);
