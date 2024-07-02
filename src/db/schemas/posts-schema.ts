import mongoose from "mongoose";

export type PostDbType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

const PostsSchema = new mongoose.Schema<PostDbType>({
  title: { type: String, required: true, maxlength: 30 },
  shortDescription: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 1000 },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const PostsModel = mongoose.model("posts", PostsSchema);
