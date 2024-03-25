import mongoose from "mongoose";
import { PostDbType } from "../../types/db-types";

const PostsSchema = new mongoose.Schema<PostDbType>({
  title: { type: String, required: true, maxlength: 30 },
  shortDescription: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 1000 },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const PostsModel = mongoose.model("posts", PostsSchema);
