import mongoose from "mongoose";
import { CommentDbType } from "../../types/db-types";

const CommentsSchema = new mongoose.Schema<CommentDbType>({
  content: { type: String },
  postId: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
});

export const CommentsModel = mongoose.model("comments", CommentsSchema);
